const express = require("express");

const {
    startRegistration,
    verifyAuthenticator,
    setPassword,
    login
} = require("../controllers/authController");

const router = express.Router();

router.post("/register/start", startRegistration);
router.post("/register/verify-authenticator", verifyAuthenticator);
router.post("/register/set-password", setPassword);
router.post("/login", login);

module.exports = router;