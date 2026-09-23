const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const QRCode = require("qrcode");
const { generateSecret, generateURI, verifySync } = require("otplib");
const { z } = require("zod");
const User = require("../models/User");
const logger = require("../utils/logger");

const personalEmailDomains = new Set([
    "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "outlook.com",
    "hotmail.com", "live.com", "icloud.com", "me.com", "aol.com", "proton.me",
    "protonmail.com", "mail.com", "gmx.com", "yandex.com"
]);
const registrationSchema = z.object({ businessId: z.string().trim().email().max(254) });
const loginSchema = z.object({ businessId: z.string().trim().email().max(254), password: z.string().min(1).max(128) });
const mfaSchema = z.object({ loginChallenge: z.string().min(32).max(128), otp: z.string().regex(/^\d{6}$/) });
const passwordSchema = z.object({ businessId: z.string().trim().email().max(254), password: z.string().min(12).max(128), confirmPassword: z.string() });
const refreshTokenTtlMs = 7 * 24 * 60 * 60 * 1000;

const normalizeBusinessId = (businessId) => typeof businessId === "string" ? businessId.trim().toLowerCase() : "";
const isBusinessEmail = (email) => {
    const match = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/.exec(normalizeBusinessId(email));
    return Boolean(match) && !personalEmailDomains.has(match[1]);
};
const tokenHash = (token) => crypto.createHash("sha256").update(token).digest("hex");
const isValidAuthenticatorCode = (token, secret) => Boolean(secret && verifySync({ token, secret }).valid);
const cookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge,
    path: "/"
});
const publicUser = (user) => ({ id: user._id, businessId: user.businessId, firstName: user.firstName, lastName: user.lastName, email: user.email });

const issueTokens = async (res, user) => {
    const accessToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = crypto.randomBytes(48).toString("hex");
    await User.updateOne({ _id: user._id }, {
        refreshTokenHash: tokenHash(refreshToken),
        refreshTokenExpiresAt: new Date(Date.now() + refreshTokenTtlMs)
    });
    res.cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie("refreshToken", refreshToken, cookieOptions(refreshTokenTtlMs));
};

const startRegistration = async (req, res) => {
    try {
        const parsed = registrationSchema.safeParse(req.body);
        const businessId = normalizeBusinessId(parsed.success ? parsed.data.businessId : "");
        if (!parsed.success || !isBusinessEmail(businessId)) return res.status(400).json({ message: "A valid business email is required" });
        const existingUser = await User.findOne({ $or: [{ businessId }, { email: businessId }] });
        if (existingUser?.isVerified) return res.status(400).json({ message: "Business ID is already registered" });
        const secret = generateSecret();
        const otpauthUri = generateURI({ issuer: "datarheo.io", label: businessId, secret });
        const qrCode = await QRCode.toDataURL(otpauthUri);
        const user = existingUser || new User({ businessId });
        user.businessId = businessId;
        user.email = businessId;
        user.authenticatorSecret = secret;
        user.authenticatorVerified = false;
        user.isVerified = false;
        user.password = undefined;
        await user.save();
        return res.status(200).json({ message: "Scan the QR code with your authenticator app", businessId, qrCode, otpauthUri });
    } catch (error) {
        logger.error({ err: error }, "Registration start error");
        return res.status(500).json({ message: "Could not start registration" });
    }
};

const verifyAuthenticator = async (req, res) => {
    try {
        const parsed = z.object({ businessId: z.string().trim().email(), otp: z.string().regex(/^\d{6}$/) }).safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ message: "Invalid authenticator code" });
        const user = await User.findOne({ businessId: normalizeBusinessId(parsed.data.businessId) }).select("+authenticatorSecret");
        if (!user || !isValidAuthenticatorCode(parsed.data.otp, user.authenticatorSecret)) return res.status(400).json({ message: "Invalid authenticator code" });
        user.authenticatorVerified = true;
        await user.save();
        return res.json({ message: "Authenticator verified. You can now set your password.", businessId: user.businessId });
    } catch (error) {
        logger.error({ err: error }, "Authenticator verification failed");
        return res.status(500).json({ message: "Authenticator verification failed" });
    }
};

const setPassword = async (req, res) => {
    try {
        const parsed = passwordSchema.safeParse(req.body);
        if (!parsed.success || parsed.data.password !== parsed.data.confirmPassword) return res.status(400).json({ message: "Password must be at least 12 characters and match confirmation" });
        const user = await User.findOne({ businessId: normalizeBusinessId(parsed.data.businessId) });
        if (!user || !user.authenticatorVerified) return res.status(400).json({ message: "Verify your authenticator before setting a password" });
        user.password = await bcrypt.hash(parsed.data.password, 12);
        user.isVerified = true;
        await user.save();
        return res.status(201).json({ message: "Registration complete. You can now log in.", businessId: user.businessId });
    } catch (error) {
        logger.error({ err: error }, "Password setup failed");
        return res.status(500).json({ message: "Password setup failed" });
    }
};

const login = async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        const identifier = normalizeBusinessId(parsed.success ? parsed.data.businessId : "");
        if (!parsed.success || !isBusinessEmail(identifier)) return res.status(400).json({ message: "Business email and password are required" });
        const user = await User.findOne({ businessId: identifier }).select("+authenticatorSecret +loginChallengeHash +loginChallengeExpiresAt");
        if (user?.lockUntil && user.lockUntil > new Date()) return res.status(423).json({ message: "Account temporarily locked. Please try again later." });
        if (!user || !user.isVerified || !user.password || !(await bcrypt.compare(parsed.data.password, user.password))) {
            if (user) {
                user.failedLoginAttempts += 1;
                if (user.failedLoginAttempts >= 5) {
                    user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
                    user.failedLoginAttempts = 0;
                }
                await user.save();
            }
            return res.status(401).json({ message: "Invalid business ID or password" });
        }
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        const loginChallenge = crypto.randomBytes(48).toString("hex");
        user.loginChallengeHash = tokenHash(loginChallenge);
        user.loginChallengeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();
        return res.json({ message: "Authenticator code required", mfaRequired: true, loginChallenge });
    } catch (error) {
        logger.error({ err: error }, "Login failed");
        return res.status(500).json({ message: "Login failed" });
    }
};

const verifyLoginMfa = async (req, res) => {
    try {
        const parsed = mfaSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ message: "Invalid authenticator code" });
        const user = await User.findOne({
            loginChallengeHash: tokenHash(parsed.data.loginChallenge),
            loginChallengeExpiresAt: { $gt: new Date() }
        }).select("+authenticatorSecret +loginChallengeHash +loginChallengeExpiresAt");
        const valid = user && user.isVerified && user.authenticatorVerified && isValidAuthenticatorCode(parsed.data.otp, user.authenticatorSecret);
        if (!valid) return res.status(401).json({ message: "Invalid or expired authenticator challenge" });
        const consumedUser = await User.findOneAndUpdate(
            { _id: user._id, loginChallengeHash: tokenHash(parsed.data.loginChallenge), loginChallengeExpiresAt: { $gt: new Date() } },
            { $unset: { loginChallengeHash: 1, loginChallengeExpiresAt: 1 } },
            { returnDocument: "after" }
        );
        if (!consumedUser) return res.status(401).json({ message: "Invalid or expired authenticator challenge" });
        await issueTokens(res, consumedUser);
        return res.json({ message: "Login successful", user: publicUser(consumedUser) });
    } catch (error) {
        logger.error({ err: error }, "MFA login failed");
        return res.status(500).json({ message: "Login failed" });
    }
};

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "Session expired" });
        const user = await User.findOne({ refreshTokenHash: tokenHash(refreshToken), refreshTokenExpiresAt: { $gt: new Date() } }).select("+refreshTokenHash +refreshTokenExpiresAt");
        if (!user) return res.status(401).json({ message: "Session expired" });
        await issueTokens(res, user);
        return res.json({ message: "Session refreshed" });
    } catch (error) {
        logger.error({ err: error }, "Token refresh failed");
        return res.status(500).json({ message: "Could not refresh session" });
    }
};

const logout = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) await User.updateOne({ refreshTokenHash: tokenHash(refreshToken) }, { $unset: { refreshTokenHash: 1, refreshTokenExpiresAt: 1 } });
    res.clearCookie("accessToken", cookieOptions(0));
    res.clearCookie("refreshToken", cookieOptions(0));
    return res.json({ message: "Logged out" });
};

module.exports = { startRegistration, verifyAuthenticator, setPassword, login, verifyLoginMfa, refresh, logout };
