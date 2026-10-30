const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const QRCode = require("qrcode");
const { generateSecret, generateURI, verifySync } = require("otplib");
const { z } = require("zod");
const config = require("../config/env");
const User = require("../entities/User");
const AuthService = require("./AuthService");
const UserRepositoryImpl = require("../repositories/UserRepositoryImpl");
const { sendPasswordResetEmail } = require("../utils/sendEmail");

const personalEmailDomains = new Set([
    "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "outlook.com",
    "hotmail.com", "live.com", "icloud.com", "me.com", "aol.com", "proton.me",
    "protonmail.com", "mail.com", "gmx.com", "yandex.com"
]);
const registrationSchema = z.object({
    businessId: z.string().trim().email().max(254),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80)
});
const loginSchema = z.object({ businessId: z.string().trim().email().max(254), password: z.string().min(1).max(128) });
const mfaSchema = z.object({
    loginChallenge: z.string().min(32).max(128),
    otp: z.string().regex(/^\d{6}$/),
    tabSession: z.boolean().optional()
});
const passwordSchema = z.object({ businessId: z.string().trim().email().max(254), password: z.string().min(12).max(128), confirmPassword: z.string() });
const authenticatorSchema = z.object({ businessId: z.string().trim().email(), otp: z.string().regex(/^\d{6}$/) });
const forgotPasswordSchema = z.object({ businessId: z.string().trim().email().max(254) });
const resetPasswordSchema = z.object({
    token: z.string().min(32).max(128),
    password: z.string().min(12).max(128),
    confirmPassword: z.string()
});
const refreshTokenTtlMs = 7 * 24 * 60 * 60 * 1000;
const passwordResetTtlMs = 30 * 60 * 1000;
const tabSessionHandoffTtlMs = 60 * 1000;
const passwordResetMessage = "If an account exists for that email, a password reset link has been sent.";
const tokenHash = (token) => crypto.createHash("sha256").update(token).digest("hex");
const hashMatches = (candidate, expected) => {
    if (typeof candidate !== "string" || typeof expected !== "string" || candidate.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(expected, "hex"));
};
const normalizeBusinessId = (businessId) => typeof businessId === "string" ? businessId.trim().toLowerCase() : "";
const isBusinessEmail = (email) => {
    const match = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/.exec(normalizeBusinessId(email));
    return Boolean(match) && !personalEmailDomains.has(match[1]);
};
const isValidAuthenticatorCode = (token, secret) => Boolean(secret && verifySync({ token, secret }).valid);
const publicUser = (user) => ({
    id: user._id, 
    businessId: user.businessId,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: [user.firstName, user.lastName].filter(Boolean).join(" "),
    email: user.email
});
const cookieOptions = (maxAge) => ({
    httpOnly: true,secure: config.NODE_ENV === "production",
    sameSite: "strict",
    domain: config.NODE_ENV === "production" ? config.COOKIE_DOMAIN || undefined : undefined,
    maxAge,path: "/"
});

class AuthError extends Error {
    constructor(status, message) {
        super(message);
        this.name = "AuthError";
        this.status = status;
    }
}

class AuthServiceImpl extends AuthService {
    constructor(userRepository = new UserRepositoryImpl(), emailSender = sendPasswordResetEmail) {
        super();
        this.userRepository = userRepository;
        this.emailSender = emailSender;
    }

    async startRegistration(body) {
        const parsed = registrationSchema.safeParse(body);
        const businessId = normalizeBusinessId(parsed.success ? parsed.data.businessId : "");
        if (!parsed.success || !isBusinessEmail(businessId)) {
            throw new AuthError(400, "A valid business email, first name, and last name are required");
        }

        const existingUser = await this.userRepository.findByBusinessIdOrEmail(businessId);
        if (existingUser?.isVerified) throw new AuthError(400, "Business ID is already registered");

        const user = existingUser || new User({ businessId });
        user.businessId = businessId;
        user.email = businessId;
        user.firstName = parsed.data.firstName;
        user.lastName = parsed.data.lastName;
        user.authenticatorSecret = null;
        user.authenticatorVerified = false;
        user.isVerified = false;
        user.password = undefined;
        await this.userRepository.save(user);
        return {
            status: 200,
            body: { message: "Account details saved. Set up your authenticator to continue.", businessId }
        };
    }

    async startAuthenticator(body) {
        const parsed = z.object({ businessId: z.string().trim().email().max(254) }).safeParse(body);
        if (!parsed.success) throw new AuthError(400, "A valid business email is required");
        const businessId = normalizeBusinessId(parsed.data.businessId);
        const user = await this.userRepository.findByBusinessId(businessId, "+authenticatorSecret");
        if (!user || user.isVerified) {
            throw new AuthError(400, "Start account registration before setting up an authenticator");
        }
        const secret = generateSecret();
        const otpauthUri = generateURI({ issuer: "datarheo.io", label: businessId, secret });
        const qrCode = await QRCode.toDataURL(otpauthUri);
        user.authenticatorSecret = secret;
        user.authenticatorVerified = false;
        await this.userRepository.save(user);
        return { status: 200, body: { message: "Scan the QR code with your authenticator app", businessId, qrCode, otpauthUri } };
    }

    async verifyAuthenticator(body) {
        const parsed = authenticatorSchema.safeParse(body);
        if (!parsed.success) throw new AuthError(400, "Invalid authenticator code");
        const user = await this.userRepository.findByBusinessId(
            normalizeBusinessId(parsed.data.businessId),
            "+authenticatorSecret"
        );
        if (!user || !isValidAuthenticatorCode(parsed.data.otp, user.authenticatorSecret)) {
            throw new AuthError(400, "Invalid authenticator code");
        }
        user.authenticatorVerified = true;
        await this.userRepository.save(user);
        return { status: 200, body: { message: "Authenticator verified. You can now set your password.", businessId: user.businessId } };
    }

    async setPassword(body) {
        const parsed = passwordSchema.safeParse(body);
        if (!parsed.success || parsed.data.password !== parsed.data.confirmPassword) {
            throw new AuthError(400, "Password must be at least 12 characters and match confirmation");
        }
        const user = await this.userRepository.findByBusinessId(normalizeBusinessId(parsed.data.businessId));
        if (!user || user.isVerified || !user.authenticatorVerified) {
            throw new AuthError(400, "Verify your authenticator before setting a password");
        }
        user.password = await bcrypt.hash(parsed.data.password, 12);
        user.isVerified = true;
        await this.userRepository.save(user);
        return { status: 201, body: { message: "Registration complete. You can now log in.", businessId: user.businessId } };
    }

    async login(body) {
        const parsed = loginSchema.safeParse(body);
        const identifier = normalizeBusinessId(parsed.success ? parsed.data.businessId : "");
        if (!parsed.success || !isBusinessEmail(identifier)) {
            throw new AuthError(400, "Business email and password are required");
        }
        const user = await this.userRepository.findByBusinessId(
            identifier,
            "+authenticatorSecret +loginChallengeHash +loginChallengeExpiresAt"
        );
        if (user?.lockUntil && user.lockUntil > new Date()) {
            throw new AuthError(423, "Account temporarily locked. Please try again later.");
        }
        if (!user || !user.isVerified || !user.password || !(await bcrypt.compare(parsed.data.password, user.password))) {
            if (user) {
                user.failedLoginAttempts += 1;
                if (user.failedLoginAttempts >= 5) {
                    user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
                    user.failedLoginAttempts = 0;
                }
                await this.userRepository.save(user);
            }
            throw new AuthError(401, "Invalid business ID or password");
        }
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        const loginChallenge = crypto.randomBytes(48).toString("hex");
        user.loginChallengeHash = tokenHash(loginChallenge);
        user.loginChallengeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.userRepository.save(user);
        return { status: 200, body: { message: "Authenticator code required", mfaRequired: true, loginChallenge } };
    }

    async requestPasswordReset(body) {
        const parsed = forgotPasswordSchema.safeParse(body);
        if (!parsed.success) {
            return { status: 200, body: { message: passwordResetMessage } };
        }

        const user = await this.userRepository.findByBusinessId(normalizeBusinessId(parsed.data.businessId));
        if (user?.isVerified) {
            const token = crypto.randomBytes(32).toString("hex");
            const resetTokenHash = tokenHash(token);
            user.passwordResetTokenHash = resetTokenHash;
            user.passwordResetExpiresAt = new Date(Date.now() + passwordResetTtlMs);
            await this.userRepository.save(user);
            const resetUrl = new URL(config.RESET_PASSWORD_URL);
            resetUrl.hash = new URLSearchParams({ token }).toString();
            await this.emailSender(user.email || user.businessId, resetUrl.toString());
        }

        return { status: 200, body: { message: passwordResetMessage } };
    }

    async resetPassword(body) {
        const parsed = resetPasswordSchema.safeParse(body);
        if (!parsed.success || parsed.data.password !== parsed.data.confirmPassword) {
            throw new AuthError(400, "Password must be at least 12 characters and match confirmation");
        }

        const resetTokenHash = tokenHash(parsed.data.token);
        const user = await this.userRepository.findPasswordResetToken(resetTokenHash, new Date());
        if (!user) throw new AuthError(400, "This password reset link is invalid or has expired");

        const password = await bcrypt.hash(parsed.data.password, 12);
        const updatedUser = await this.userRepository.consumePasswordResetToken(user._id, resetTokenHash, new Date(),password  );
        if (!updatedUser) throw new AuthError(400, "This password reset link is invalid or has expired");
        await this.userRepository.revokeAllAuthSessions?.(updatedUser._id);
        return { status: 200, body: { message: "Password reset successfully. You can now sign in." } };
    }

    async verifyLoginMfa(body) {
        const parsed = mfaSchema.safeParse(body);
        if (!parsed.success) throw new AuthError(400, "Invalid authenticator code");
        const challengeHash = tokenHash(parsed.data.loginChallenge);
        const now = new Date();
        const user = await this.userRepository.findLoginChallenge(challengeHash, now);
        const valid = user && user.isVerified && user.authenticatorVerified && isValidAuthenticatorCode(parsed.data.otp, user.authenticatorSecret);
        if (!valid) throw new AuthError(401, "Invalid or expired authenticator challenge");

        const consumedUser = await this.userRepository.consumeLoginChallenge(user._id, challengeHash, now);
        if (!consumedUser) throw new AuthError(401, "Invalid or expired authenticator challenge");
        const session = await this.issueTokens(consumedUser, { tabSession: parsed.data.tabSession === true });
        return {
            status: 200,
            cookies: session.cookies || [],
            body: {
                message: "Login successful",
                user: publicUser(consumedUser),
                ...(session.handoffToken ? { tabSessionHandoff: session.handoffToken } : {})
            }
        };
    }

    async refresh(cookies, body = {}) {
        const refreshToken = body.refreshToken || cookies?.refreshToken;
        if (!refreshToken) throw new AuthError(401, "Session expired");
        const refreshTokenHash = tokenHash(refreshToken);
        let session = await this.userRepository.findAuthSessionByRefreshToken?.(refreshTokenHash);
        let user;

        if (session) {
            user = await this.userRepository.findById(session.userId);
        } else {
            user = await this.userRepository.findRefreshToken(refreshTokenHash, new Date());
            if (!user) throw new AuthError(401, "Session expired");
            session = {
                sessionId: user.sessionId || crypto.randomBytes(32).toString("base64url"),
                refreshTokenHash
            };
            if (this.userRepository.createAuthSession) {
                await this.userRepository.createAuthSession({
                    userId: user._id,
                    sessionId: session.sessionId,
                    refreshTokenHash
                });
                await this.userRepository.revokeRefreshToken(refreshTokenHash);
            }
        }

        if (!user?.isVerified) throw new AuthError(401, "Session expired");
        const renewed = await this.issueTokens(user, {
            tabSession: Boolean(body.refreshToken),
            createHandoff: false,
            sessionId: session.sessionId,
            currentRefreshTokenHash: refreshTokenHash
        });
        return {
            status: 200,
            cookies: renewed.cookies || [],
            body: {
                message: "Session refreshed",
                ...(renewed.tokens ? { tabSession: renewed.tokens } : {})
            }
        };
    }

    async exchangeTabSessionHandoff(body = {}) {
        if (typeof body.handoffToken !== "string" || body.handoffToken.length < 32) {
            throw new AuthError(401, "Tab session handoff is invalid or expired");
        }
        const session = await this.userRepository.consumeTabSessionHandoff(
            tokenHash(body.handoffToken),
            new Date()
        );
        if (!session) throw new AuthError(401, "Tab session handoff is invalid or expired");
        const user = await this.userRepository.findById(session.userId);
        if (!user?.isVerified) throw new AuthError(401, "Authentication required");
        const renewed = await this.issueTokens(user, {
            tabSession: true,
            createHandoff: false,
            sessionId: session.sessionId,
            currentRefreshTokenHash: session.refreshTokenHash
        });
        return {
            status: 200,
            cookies: [],
            body: {
                tabSession: renewed.tokens,
                user: publicUser(user)
            }
        };
    }

    async logout(credentials) {
        const refreshToken = credentials?.refreshToken;
        const accessToken = credentials?.accessToken;
        let sessionId;
        if (accessToken) {
            try {
                const payload = jwt.verify(accessToken, config.JWT_SECRET, { ignoreExpiration: true });
                sessionId = payload.sessionId;
            } catch {
                sessionId = undefined;
            }
        }

        if (sessionId && this.userRepository.revokeAuthSession) {
            await this.userRepository.revokeAuthSession(sessionId);
        } else if (refreshToken && this.userRepository.revokeAuthSessionByRefreshToken) {
            await this.userRepository.revokeAuthSessionByRefreshToken(tokenHash(refreshToken));
        } else if (sessionId) {
            await this.userRepository.revokeSession(sessionId);
        } else if (refreshToken) {
            await this.userRepository.revokeRefreshToken(tokenHash(refreshToken));
        }

        return {
            status: 200,
            clearCookies: credentials?.tabSession
                ? []
                : [
                    { name: "accessToken", options: cookieOptions(0) },
                    { name: "refreshToken", options: cookieOptions(0) }
                ],
            body: { message: "Logged out" }
        };
    }

    async getCurrentUser(cookies) {
        const accessToken = cookies?.accessToken;
        if (!accessToken) throw new AuthError(401, "Authentication required");
        let payload;
        try {
            payload = jwt.verify(accessToken, config.JWT_SECRET);
        } catch {
            throw new AuthError(401, "Authentication required");
        }
        const user = await this.userRepository.findById(payload.userId);
        const session = payload.sessionId
            ? await this.userRepository.findAuthSession?.(payload.sessionId)
            : null;
        const hasValidSession = session
            ? String(session.userId) === String(payload.userId)
            : payload.sessionId && payload.sessionId === user?.sessionId;
        if (!user || !user.isVerified || !hasValidSession) {
            throw new AuthError(401, "Authentication required");
        }
        return { status: 200, body: { user: publicUser(user) } };
    }

    async issueTokens(user, {
        tabSession = false,
        createHandoff = true,
        sessionId,
        currentRefreshTokenHash
    } = {}) {
        sessionId ||= crypto.randomBytes(32).toString("base64url");
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, sessionId },config.JWT_SECRET,{ expiresIn: "15m" }
        );
        const refreshToken = crypto.randomBytes(48).toString("hex");
        const refreshTokenHash = tokenHash(refreshToken);
        const handoffToken = tabSession && createHandoff
            ? crypto.randomBytes(48).toString("hex")
            : null;

        if (this.userRepository.createAuthSession) {
            if (currentRefreshTokenHash) {
                const result = await this.userRepository.rotateAuthSessionRefreshToken(
                    sessionId,
                    currentRefreshTokenHash,
                    refreshTokenHash
                );
                if (!result.matchedCount) throw new AuthError(401, "Session expired");
            } else {
                await this.userRepository.createAuthSession({
                    userId: user._id,
                    sessionId,
                    refreshTokenHash,
                    ...(tabSession && createHandoff ? {
                        handoffHash: tokenHash(handoffToken),
                        handoffExpiresAt: new Date(Date.now() + tabSessionHandoffTtlMs)
                    } : {})
                });
            }
        } else {
            user.sessionId = sessionId;
            await this.userRepository.updateRefreshToken(
                user._id,
                refreshTokenHash,
                new Date(Date.now() + refreshTokenTtlMs),
                sessionId
            );
        }

        if (tabSession) {
            if (createHandoff) return { handoffToken };
            return { tokens: { accessToken, refreshToken } };
        }

        return {
            cookies: [
                { name: "accessToken", value: accessToken, options: cookieOptions(15 * 60 * 1000) },
                { name: "refreshToken", value: refreshToken, options: cookieOptions(refreshTokenTtlMs) }
            ]
        };
    }
}

AuthServiceImpl.AuthError = AuthError;

module.exports = AuthServiceImpl;
