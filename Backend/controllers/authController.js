const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOTPEmail = require("../utils/sendEmail");

// Generate 6 digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const requestRegistrationOtp = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                message: "First name, last name, and email are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({
                message: "Email is already registered"
            });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        let user;

        if (existingUser) {
            existingUser.firstName = firstName;
            existingUser.lastName = lastName;
            existingUser.otp = otp;
            existingUser.otpExpires = otpExpires;
            existingUser.otpVerified = false;
            user = await existingUser.save();
        } else {
            user = await User.create({
                firstName,
                lastName,
                email: normalizedEmail,
                otp,
                otpExpires,
                isVerified: false,
                otpVerified: false
            });
        }

        await sendOTPEmail(user.email, otp);

        return res.status(200).json({
            message: "OTP sent to your email",
            email: user.email
        });
    } catch (error) {
        console.error("OTP request error:", error);
        res.status(500).json({
            message: "Could not send OTP",
            error: error.message
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email: email?.trim().toLowerCase() });

        if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.otp = null;
        user.otpExpires = null;
        user.otpVerified = true;
        await user.save();

        return res.json({ message: "Email verified. You can now set your password.", email: user.email });
    } catch (error) {
        res.status(500).json({ message: "OTP verification failed", error: error.message });
    }
};

const setPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const user = await User.findOne({ email: email?.trim().toLowerCase() });

        if (!user || !user.otpVerified) {
            return res.status(400).json({ message: "Verify your email before setting a password" });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.isVerified = true;
        user.otpVerified = false;
        await user.save();

        return res.status(201).json({ message: "Registration complete. You can now log in.", email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Password setup failed", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email?.trim().toLowerCase() });

        if (!user || !user.isVerified || !user.password || !(await bcrypt.compare(password || "", user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            message: "Login successful",
            token,
            user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

module.exports = {
    requestRegistrationOtp,
    verifyOtp,
    setPassword,
    login
};
