const test = require("node:test");
const assert = require("node:assert/strict");
const { generateSync } = require("otplib");

const baseUrl = (process.env.TEST_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const email = process.env.TEST_BUSINESS_EMAIL;
const password = process.env.TEST_PASSWORD;
const lockoutEmail = process.env.TEST_LOCKOUT_EMAIL || email;

const request = async (path, options = {}) => {
    const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const body = await response.json().catch(() => ({}));
    return { response, body };
};

const post = (path, body, headers) => request(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
});

const cookieHeader = (response, existing = "") => {
    const setCookies = response.headers.getSetCookie?.() || [];
    const cookies = new Map(existing.split(";").map((cookie) => cookie.trim().split("=")).filter(([name]) => name));
    for (const setCookie of setCookies) {
        const [name, value] = setCookie.split(";", 1)[0].split("=");
        cookies.set(name, value);
    }
    return [...cookies].map(([name, value]) => `${name}=${value}`).join("; ");
};

test("registration, MFA login, refresh, and logout lifecycle", { skip: !email || !password }, async () => {
    const registrationEmail = `${Date.now()}-${email}`;
    const started = await post("/api/auth/register/start", { businessId: registrationEmail });
    assert.equal(started.response.status, 200, JSON.stringify(started.body));
    const secret = new URL(started.body.otpauthUri).searchParams.get("secret");
    assert.ok(secret);

    const invalidRegistration = await post("/api/auth/register/verify-authenticator", { businessId: registrationEmail, otp: "000000" });
    assert.equal(invalidRegistration.response.status, 400);
    const code = generateSync({ secret });
    const verified = await post("/api/auth/register/verify-authenticator", { businessId: registrationEmail, otp: code });
    assert.equal(verified.response.status, 200, JSON.stringify(verified.body));
    const setPassword = await post("/api/auth/register/set-password", { businessId: registrationEmail, password, confirmPassword: password });
    assert.equal(setPassword.response.status, 201, JSON.stringify(setPassword.body));

    const login = await post("/api/auth/login", { businessId: registrationEmail, password });
    assert.equal(login.response.status, 200);
    const challenge = login.body.loginChallenge;
    const invalidMfa = await post("/api/auth/login/verify-mfa", { loginChallenge: challenge, otp: "000000" });
    assert.equal(invalidMfa.response.status, 401);
    const authenticated = await post("/api/auth/login/verify-mfa", { loginChallenge: challenge, otp: generateSync({ secret }) });
    assert.equal(authenticated.response.status, 200, JSON.stringify(authenticated.body));
    let cookies = cookieHeader(authenticated.response);
    assert.match(cookies, /accessToken=/);
    assert.match(cookies, /refreshToken=/);

    const refreshed = await request("/api/auth/refresh", { method: "POST", headers: { Cookie: cookies } });
    assert.equal(refreshed.response.status, 200);
    cookies = cookieHeader(refreshed.response, cookies);
    const loggedOut = await request("/api/auth/logout", { method: "POST", headers: { Cookie: cookies } });
    assert.equal(loggedOut.response.status, 200);
    const afterLogout = await request("/api/auth/refresh", { method: "POST", headers: { Cookie: cookieHeader(loggedOut.response, cookies) } });
    assert.equal(afterLogout.response.status, 401);
});

test("account locks after five failed passwords", { skip: !lockoutEmail || !password }, async () => {
    for (let attempt = 1; attempt <= 5; attempt += 1) {
        const result = await post("/api/auth/login", { businessId: lockoutEmail, password: `${password}-wrong` });
        assert.equal(result.response.status, 401, JSON.stringify(result.body));
    }
    const locked = await post("/api/auth/login", { businessId: lockoutEmail, password });
    assert.equal(locked.response.status, 423, JSON.stringify(locked.body));
});