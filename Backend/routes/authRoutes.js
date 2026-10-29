const express = require("express");
const { startRegistration, startAuthenticator, verifyAuthenticator, setPassword, login, requestPasswordReset, resetPassword, verifyLoginMfa, refresh, logout, getCurrentUser } = require("../controllers/authController");
const { loginLimiter, registrationLimiter } = require("../middleware/rateLimiters");
const router = express.Router();

router.post("/register/start", registrationLimiter, startRegistration);
router.post("/register/start-authenticator", registrationLimiter, startAuthenticator);
router.post("/register/verify-authenticator", registrationLimiter, verifyAuthenticator);
router.post("/register/set-password", registrationLimiter, setPassword);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", loginLimiter, requestPasswordReset);
router.post("/reset-password", loginLimiter, resetPassword);
router.post("/login/verify-mfa", loginLimiter, verifyLoginMfa);
router.post("/login/verify-otp", loginLimiter, verifyLoginMfa);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", getCurrentUser);

module.exports = router;