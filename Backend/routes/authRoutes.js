const express = require("express");
const { startRegistration, verifyAuthenticator, setPassword, login, verifyLoginMfa, refresh, logout } = require("../controllers/authController");
const { loginLimiter, registrationLimiter } = require("../middleware/rateLimiters");
const router = express.Router();

router.post("/register/start", registrationLimiter, startRegistration);
router.post("/register/verify-authenticator", registrationLimiter, verifyAuthenticator);
router.post("/register/set-password", registrationLimiter, setPassword);
router.post("/login", loginLimiter, login);
router.post("/login/verify-mfa", loginLimiter, verifyLoginMfa);
router.post("/login/verify-otp", loginLimiter, verifyLoginMfa);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;