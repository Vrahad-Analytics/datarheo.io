class UserRepository {
    findByBusinessId() {
        throw new Error("findByBusinessId must be implemented");
    }

    findByBusinessIdOrEmail() {
        throw new Error("findByBusinessIdOrEmail must be implemented");
    }

    findById() {
        throw new Error("findById must be implemented");
    }

    findLoginChallenge() {
        throw new Error("findLoginChallenge must be implemented");
    }

    consumeLoginChallenge() {
        throw new Error("consumeLoginChallenge must be implemented");
    }

    findRefreshToken() {
        throw new Error("findRefreshToken must be implemented");
    }

    findPasswordResetToken() {
        throw new Error("findPasswordResetToken must be implemented");
    }

    consumePasswordResetToken() {
        throw new Error("consumePasswordResetToken must be implemented");
    }

    save() {
        throw new Error("save must be implemented");
    }

    updateRefreshToken() {
        throw new Error("updateRefreshToken must be implemented");
    }

    revokeRefreshToken() {
        throw new Error("revokeRefreshToken must be implemented");
    }
}

module.exports = UserRepository;
