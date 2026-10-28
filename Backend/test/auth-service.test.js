process.env.MONGO_URI ||= "mongodb://127.0.0.1:27017/datarheo-test";
process.env.JWT_SECRET ||= "auth-service-unit-test-secret-at-least-32";
process.env.FRONTEND_URL ||= "http://localhost:5173";

const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const { generateSecret, generateSync } = require("otplib");
const config = require("../config/env");
const AuthServiceImpl = require("../services/AuthServiceImpl");

test("registration persists names and sends a business-email challenge before authenticator setup", async () => {
    let savedUser;
    let verificationEmail;
    const repository = {
        findByBusinessIdOrEmail: async () => null,
        save: async (user) => {
            savedUser = user;
            return user;
        }
    };
    const service = new AuthServiceImpl(repository, undefined, async (email, code) => {
        verificationEmail = { email, code };
    });

    const result = await service.startRegistration({
        businessId: "ada@analytical.example",
        firstName: " Ada ",
        lastName: " Lovelace "
    });

    assert.equal(result.status, 200);
    assert.equal(savedUser.firstName, "Ada");
    assert.equal(savedUser.lastName, "Lovelace");
    assert.match(result.body.message, /business email/);
    assert.equal(result.body.qrCode, undefined);
    assert.equal(verificationEmail.email, "ada@analytical.example");
    assert.notEqual(savedUser.registrationEmailVerificationHash, verificationEmail.code);
    assert.ok(savedUser.registrationEmailVerificationExpiresAt > new Date());
});

test("email ownership is required before authenticator enrollment and password creation", async () => {
    let verificationCode;
    let savedUser;
    const repository = {
        findByBusinessIdOrEmail: async () => null,
        findRegistrationEmailChallenge: async () => savedUser,
        consumeRegistrationEmailChallenge: async (_id, hash) => {
            if (savedUser.registrationEmailVerificationHash !== hash) return null;
            savedUser.registrationEmailVerifiedAt = new Date();
            savedUser.registrationEmailVerificationHash = undefined;
            savedUser.registrationEmailVerificationExpiresAt = undefined;
            return savedUser;
        },
        findByBusinessId: async () => savedUser,
        save: async (user) => {
            savedUser = user;
            return user;
        }
    };
    const service = new AuthServiceImpl(repository, undefined, async (_email, code) => {
        verificationCode = code;
    });
    const businessId = "ada@analytical.example";

    await service.startRegistration({ businessId, firstName: "Ada", lastName: "Lovelace" });
    await assert.rejects(
        service.startAuthenticator({ businessId }),
        { name: "AuthError", status: 400 }
    );
    await assert.rejects(
        service.verifyRegistrationEmail({ businessId, verificationCode: "000000" }),
        { name: "AuthError", status: 400 }
    );

    const emailVerified = await service.verifyRegistrationEmail({ businessId, verificationCode });
    assert.equal(emailVerified.status, 200);
    const authenticator = await service.startAuthenticator({ businessId });
    const secret = new URL(authenticator.body.otpauthUri).searchParams.get("secret");
    assert.ok(secret);
    await service.verifyAuthenticator({ businessId, otp: generateSync({ secret }) });
    const passwordSet = await service.setPassword({
        businessId,
        password: "secure registration password",
        confirmPassword: "secure registration password"
    });
    assert.equal(passwordSet.status, 201);
    assert.equal(savedUser.isVerified, true);
    assert.equal(savedUser.registrationEmailVerificationHash, undefined);
});

test("MFA response and current-user endpoint expose the actual display name", async () => {
    const secret = generateSecret();
    const user = {
        _id: "user-123",
        businessId: "ada@analytical.example",
        email: "ada@analytical.example",
        firstName: "Ada",
        lastName: "Lovelace",
        isVerified: true,
        authenticatorVerified: true,
        authenticatorSecret: secret
    };
    const repository = {
        findLoginChallenge: async () => user,
        consumeLoginChallenge: async () => user,
        updateRefreshToken: async () => {},
        revokeSession: async (sessionId) => {
            if (user.sessionId === sessionId) user.sessionId = null;
        },
        findById: async () => user
    };
    const service = new AuthServiceImpl(repository);
    const challenge = "c".repeat(96);
    const login = await service.verifyLoginMfa({
        loginChallenge: challenge,
        otp: generateSync({ secret })
    });

    assert.equal(login.body.user.displayName, "Ada Lovelace");
    assert.equal(login.body.user.firstName, "Ada");
    assert.equal(login.body.user.lastName, "Lovelace");
    const accessToken = login.cookies.find(({ name }) => name === "accessToken").value;
    const profile = await service.getCurrentUser({ accessToken });
    assert.equal(profile.body.user.displayName, "Ada Lovelace");
    assert.equal(jwt.verify(accessToken, config.JWT_SECRET).userId, "user-123");
    const refreshToken = login.cookies.find(({ name }) => name === "refreshToken").value;
    await service.logout({ accessToken, refreshToken });
    await assert.rejects(service.getCurrentUser({ accessToken }), { name: "AuthError", status: 401 });
});

test("forgot password sends a reset link without exposing the token in the URL query", async () => {
    const user = {
        _id: "user-456",
        businessId: "ada@analytical.example",
        email: "ada@analytical.example",
        isVerified: true
    };
    let sentEmail;
    const repository = {
        findByBusinessId: async () => user,
        save: async () => {}
    };
    const service = new AuthServiceImpl(repository, async (email, url) => {
        sentEmail = { email, url };
    });

    const result = await service.requestPasswordReset({ businessId: user.businessId });

    assert.equal(result.status, 200);
    assert.match(result.body.message, /If an account exists/);
    assert.equal(sentEmail.email, user.email);
    const resetUrl = new URL(sentEmail.url);
    const token = new URLSearchParams(resetUrl.hash.slice(1)).get("token");
    const configuredResetUrl = new URL(config.RESET_PASSWORD_URL);
    assert.equal(resetUrl.origin, configuredResetUrl.origin);
    assert.equal(resetUrl.pathname, configuredResetUrl.pathname);
    assert.equal(configuredResetUrl.origin, "http://localhost:5173");
    assert.equal(resetUrl.search, "");
    assert.equal(user.passwordResetTokenHash, crypto.createHash("sha256").update(token).digest("hex"));
    assert.ok(user.passwordResetExpiresAt > new Date());
});

test("forgot password returns the same response when the account does not exist", async () => {
    let emailSent = false;
    const service = new AuthServiceImpl({
        findByBusinessId: async () => null
    }, async () => {
        emailSent = true;
    });

    const result = await service.requestPasswordReset({ businessId: "unknown@analytical.example" });
    assert.equal(result.status, 200);
    assert.match(result.body.message, /If an account exists/);
    assert.equal(emailSent, false);
});

test("password reset email sender identifies missing SMTP configuration", async () => {
    const sendPasswordResetEmail = require("../utils/sendEmail").sendPasswordResetEmail;
    const originalUser = process.env.EMAIL_USER;
    const originalPassword = process.env.EMAIL_PASSWORD;
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASSWORD;

    try {
        await assert.rejects(
            sendPasswordResetEmail("ada@analytical.example", "https://app.datarheo.io/reset-password"),
            { code: "EMAIL_CONFIGURATION_MISSING" }
        );
    } finally {
        if (originalUser === undefined) delete process.env.EMAIL_USER;
        else process.env.EMAIL_USER = originalUser;
        if (originalPassword === undefined) delete process.env.EMAIL_PASSWORD;
        else process.env.EMAIL_PASSWORD = originalPassword;
    }
});

test("password reset consumes the token and changes the password", async () => {
    const crypto = require("node:crypto");
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    let consumed;
    const user = { _id: "user-789" };
    const repository = {
        findPasswordResetToken: async (hash) => hash === tokenHash ? user : null,
        consumePasswordResetToken: async (...args) => {
            consumed = args;
            return user;
        }
    };
    const service = new AuthServiceImpl(repository);
    const result = await service.resetPassword({
        token: rawToken,
        password: "new secure password",
        confirmPassword: "new secure password"
    });

    assert.equal(result.status, 200);
    assert.equal(consumed[0], user._id);
    assert.equal(consumed[1], tokenHash);
    assert.notEqual(consumed[3], "new secure password");
    assert.equal(await require("bcryptjs").compare("new secure password", consumed[3]), true);
});

test("password reset rejects expired or already-consumed links", async () => {
    const service = new AuthServiceImpl({
        findPasswordResetToken: async () => null
    });

    await assert.rejects(
        service.resetPassword({
            token: "t".repeat(64),
            password: "new secure password",
            confirmPassword: "new secure password"
        }),
        { name: "AuthError", status: 400 }
    );
});
