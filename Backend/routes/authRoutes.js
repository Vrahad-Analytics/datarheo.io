const express = require("express");

const {
    requestRegistrationOtp,
    verifyOtp,
    setPassword,
    login
} = require("../controllers/authController");

const router = express.Router();

router.post("/register/request-otp", requestRegistrationOtp);
router.post("/register/verify-otp", verifyOtp);
router.post("/register/set-password", setPassword);
router.post("/login", login);

module.exports = router;