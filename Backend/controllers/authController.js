const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const { generateSecret, generateURI, verifySync } = require("otplib");
const User = require("../models/User");

const personalEmailDomains = new Set([
    "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "outlook.com",
    "hotmail.com", "live.com", "icloud.com", "me.com", "aol.com", "proton.me",
    "protonmail.com", "mail.com", "gmx.com", "yandex.com"
]);

const normalizeBusinessId = (businessId) => {
    if (typeof businessId !== "string") return "";
    return businessId.trim().toLowerCase();
};

const isBusinessEmail = (email) => {
    const normalizedEmail = normalizeBusinessId(email);
    const emailMatch = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/.exec(normalizedEmail);
    return Boolean(emailMatch) && !personalEmailDomains.has(emailMatch[1]);
};

const startRegistration = async (req, res) => {
    try {
        const businessId = normalizeBusinessId(req.body.businessId);
        if (!isBusinessEmail(businessId)) {
            return res.status(400).json({ message: "A valid business email is required" });
        }

        const existingUser = await User.findOne({
            $or: [{ businessId }, { email: businessId }]
        });
        if (existingUser?.isVerified) {
            return res.status(400).json({ message: "Business ID is already registered" });
        }

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

        return res.status(200).json({
            message: "Scan the QR code with your authenticator app",
            businessId,
            qrCode,
            otpauthUri
        });
    } catch (error) {
        console.error("Registration start error:", error);
        res.status(500).json({ message: "Could not start registration", error: error.message });
    }
};

const verifyAuthenticator = async (req, res) => {
    try {
        const businessId = normalizeBusinessId(req.body.businessId);
        const otp = String(req.body.otp || "").trim();
        const user = await User.findOne({ businessId }).select("+authenticatorSecret");

        if (!user || !user.authenticatorSecret || !verifySync({ token: otp, secret: user.authenticatorSecret })) {
            return res.status(400).json({ message: "Invalid authenticator code" });
        }

        user.authenticatorVerified = true;
        await user.save();

        return res.json({ message: "Authenticator verified. You can now set your password.", businessId });
    } catch (error) {
        res.status(500).json({ message: "Authenticator verification failed", error: error.message });
    }
};

const setPassword = async (req, res) => {
    try {
        const businessId = normalizeBusinessId(req.body.businessId);
        const { password, confirmPassword } = req.body;
        const user = await User.findOne({ businessId });

        if (!user || !user.authenticatorVerified) {
            return res.status(400).json({ message: "Verify your authenticator before setting a password" });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.isVerified = true;
        user.authenticatorSecret = undefined;
        await user.save();

        return res.status(201).json({ message: "Registration complete. You can now log in.", businessId: user.businessId });
    } catch (error) {
        res.status(500).json({ message: "Password setup failed", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { businessId, password } = req.body;
        const identifier = normalizeBusinessId(businessId);
        if (!isBusinessEmail(identifier)) {
            return res.status(400).json({ message: "A valid business email is required" });
        }
        const user = await User.findOne({ businessId: identifier });

        if (!user || !user.isVerified || !user.password || !(await bcrypt.compare(password || "", user.password))) {
            return res.status(401).json({ message: "Invalid business ID or password" });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            message: "Login successful",
            token,
            user: { id: user._id, businessId: user.businessId, firstName: user.firstName, lastName: user.lastName, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

module.exports = {
    startRegistration,
    verifyAuthenticator,
    setPassword,
    login
};
