class AuthService {
    startRegistration() {
        throw new Error("startRegistration must be implemented");
    }

    verifyAuthenticator() {
        throw new Error("verifyAuthenticator must be implemented");
    }

    setPassword() {
        throw new Error("setPassword must be implemented");
    }

    login() {
        throw new Error("login must be implemented");
    }

    requestPasswordReset() {
        throw new Error("requestPasswordReset must be implemented");
    }

    resetPassword() {
        throw new Error("resetPassword must be implemented");
    }

    verifyLoginMfa() {
        throw new Error("verifyLoginMfa must be implemented");
    }

    refresh() {
        throw new Error("refresh must be implemented");
    }

    logout() {
        throw new Error("logout must be implemented");
    }

    getCurrentUser() {
        throw new Error("getCurrentUser must be implemented");
    }
}

module.exports = AuthService;
