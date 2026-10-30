const AuthServiceImpl = require("../services/AuthServiceImpl");
const logger = require("../utils/logger");

const authService = new AuthServiceImpl();
const { AuthError } = AuthServiceImpl;

function authCredentials(req) {
    const bearerToken = /^Bearer\s+(.+)$/i.exec(req.get("authorization") || "")?.[1];
    return {
        ...req.cookies,
        ...req.body,
        accessToken: bearerToken || req.body?.accessToken || req.cookies?.accessToken,
        refreshToken: req.body?.refreshToken || req.cookies?.refreshToken,
        tabSession: Boolean(req.body?.tabSession || req.body?.refreshToken)
    };
}

const controller = (method, failureMessage) => async (req, res) => {
    try {
        const result = method === "getCurrentUser" || method === "logout"
            ? await authService[method](authCredentials(req))
            : method === "refresh"
                ? await authService[method](req.cookies, req.body)
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
                message: "Email delivery is unavailable right now. Please try again later."
            });
        }
        return res.status(500).json({ message: failureMessage });
    }
};

module.exports = {
    startRegistration: controller("startRegistration", "Could not start registration"),
    startAuthenticator: controller("startAuthenticator", "Could not start authenticator setup"),
    verifyAuthenticator: controller("verifyAuthenticator", "Authenticator verification failed"),
    setPassword: controller("setPassword", "Password setup failed"),
    login: controller("login", "Login failed"),
    requestPasswordReset: controller("requestPasswordReset", "Could not request password reset"),
    resetPassword: controller("resetPassword", "Could not reset password"),
    verifyLoginMfa: controller("verifyLoginMfa", "Login failed"),
    exchangeTabSessionHandoff: controller("exchangeTabSessionHandoff", "Could not establish tab session"),
    refresh: controller("refresh", "Could not refresh session"),
    logout: controller("logout", "Could not log out"),
    getCurrentUser: controller("getCurrentUser", "Could not retrieve current user")
};
