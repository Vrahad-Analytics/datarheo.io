const AuthServiceImpl = require("../services/AuthServiceImpl");
const logger = require("../utils/logger");

const authService = new AuthServiceImpl();
const { AuthError } = AuthServiceImpl;

const controller = (method, failureMessage) => async (req, res) => {
    try {
        const result = method === "refresh" || method === "logout" || method === "getCurrentUser"
            ? await authService[method](req.cookies)
            : await authService[method](req.body);
        for (const cookie of result.cookies || []) {
            res.cookie(cookie.name, cookie.value, cookie.options);
        }
        for (const cookie of result.clearCookies || []) {
            res.clearCookie(cookie.name, cookie.options);
        }
        return res.status(result.status || 200).json(result.body);
    } catch (error) {
        if (error instanceof AuthError) {
            return res.status(error.status).json({ message: error.message });
        }
        logger.error({ err: error }, failureMessage);
        if (method === "requestPasswordReset" && error.code?.startsWith("EMAIL_")) {
            return res.status(503).json({
                message: "Password reset email is unavailable right now. Please contact support."
            });
        }
        return res.status(500).json({ message: failureMessage });
    }
};

module.exports = {
    startRegistration: controller("startRegistration", "Could not start registration"),
    verifyAuthenticator: controller("verifyAuthenticator", "Authenticator verification failed"),
    setPassword: controller("setPassword", "Password setup failed"),
    login: controller("login", "Login failed"),
    requestPasswordReset: controller("requestPasswordReset", "Could not request password reset"),
    resetPassword: controller("resetPassword", "Could not reset password"),
    verifyLoginMfa: controller("verifyLoginMfa", "Login failed"),
    refresh: controller("refresh", "Could not refresh session"),
    logout: controller("logout", "Could not log out"),
    getCurrentUser: controller("getCurrentUser", "Could not retrieve current user")
};
