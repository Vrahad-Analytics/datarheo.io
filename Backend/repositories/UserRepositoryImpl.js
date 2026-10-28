const User = require("../entities/User");
const UserRepository = require("./UserRepository");

class UserRepositoryImpl extends UserRepository {
    findByBusinessId(businessId, select = "") {
        return User.findOne({ businessId }).select(select);
    }

    findRegistrationEmailChallenge(businessId) {
        return User.findOne({ businessId }).select("+registrationEmailVerificationHash +registrationEmailVerificationExpiresAt");
    }

    consumeRegistrationEmailChallenge(userId, challengeHash, now) {
        return User.findOneAndUpdate(
            {
                _id: userId,
                registrationEmailVerificationHash: challengeHash,
                registrationEmailVerificationExpiresAt: { $gt: now }
            },
            {
                $set: { registrationEmailVerifiedAt: now },
                $unset: { registrationEmailVerificationHash: 1, registrationEmailVerificationExpiresAt: 1 }
            },
            { returnDocument: "after" }
        );
    }

    findByBusinessIdOrEmail(businessId) {
        return User.findOne({ $or: [{ businessId }, { email: businessId }] });
    }

    findById(userId) {
        return User.findById(userId).select("+sessionId");
    }

    findLoginChallenge(challengeHash, now) {
        return User.findOne(
            {
                loginChallengeHash: challengeHash, loginChallengeExpiresAt: { $gt: now }
            }).select("+authenticatorSecret +loginChallengeHash +loginChallengeExpiresAt");
    }

    consumeLoginChallenge(userId, challengeHash, now) {
        return User.findOneAndUpdate(
            { _id: userId, loginChallengeHash: challengeHash, loginChallengeExpiresAt: { $gt: now } },
            { $unset: { loginChallengeHash: 1, loginChallengeExpiresAt: 1 } },
            { returnDocument: "after" }
        );
    }

    findRefreshToken(refreshTokenHash, now) {
        return User.findOne({ refreshTokenHash, refreshTokenExpiresAt: { $gt: now } }).select("+refreshTokenHash +refreshTokenExpiresAt");
    }

    findPasswordResetToken(passwordResetTokenHash, now) {
        return User.findOne({
            passwordResetTokenHash,
            passwordResetExpiresAt: { $gt: now },
            isVerified: true
        }).select("+passwordResetTokenHash +passwordResetExpiresAt");
    }

    consumePasswordResetToken(userId, passwordResetTokenHash, now, password) {
        return User.findOneAndUpdate(
            {
                _id: userId,
                passwordResetTokenHash,
                passwordResetExpiresAt: { $gt: now },
                isVerified: true
            },
            {
                $set: { password },
                $unset: {
                    passwordResetTokenHash: 1,
                    passwordResetExpiresAt: 1,
                    refreshTokenHash: 1,
                    refreshTokenExpiresAt: 1,
                    loginChallengeHash: 1,
                    loginChallengeExpiresAt: 1,
                    sessionId: 1
                }
            },
            { returnDocument: "after" }
        );
    }

    save(user) {
        return user.save();
    }

    updateRefreshToken(userId, refreshTokenHash, refreshTokenExpiresAt, sessionId) {
        return User.updateOne({ _id: userId }, { refreshTokenHash, refreshTokenExpiresAt, sessionId });
    }

    revokeRefreshToken(refreshTokenHash) {
        return User.updateOne({ refreshTokenHash }, { $unset: { refreshTokenHash: 1, refreshTokenExpiresAt: 1, sessionId: 1 } });
    }

    revokeSession(sessionId) {
        return User.updateOne({ sessionId }, { $unset: { refreshTokenHash: 1, refreshTokenExpiresAt: 1, sessionId: 1 } });
    }
}

module.exports = UserRepositoryImpl;
