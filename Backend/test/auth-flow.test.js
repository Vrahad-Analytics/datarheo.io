const test = require("node:test");
const assert = require("node:assert/strict");
const { generateSync } = require("otplib");

const baseUrl = (process.env.TEST_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const email = process.env.TEST_BUSINESS_EMAIL;
const password = process.env.TEST_PASSWORD;
const authenticatorSecret = process.env.TEST_AUTHENTICATOR_SECRET;
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

test("MFA login, refresh, and logout revoke app access", { skip: !email || !password || !authenticatorSecret }, async () => {
    const login = await post("/api/auth/login", { businessId: email, password });
    assert.equal(login.response.status, 200);
    const challenge = login.body.loginChallenge;
    const invalidMfa = await post("/api/auth/login/verify-mfa", { loginChallenge: challenge, otp: "000000" });
    assert.equal(invalidMfa.response.status, 401);
    const authenticated = await post("/api/auth/login/verify-mfa", { loginChallenge: challenge, otp: generateSync({ secret: authenticatorSecret }) });
    assert.equal(authenticated.response.status, 200, JSON.stringify(authenticated.body));
    assert.equal(authenticated.body.user.firstName, "Ada");
    assert.equal(authenticated.body.user.lastName, "Lovelace");
    assert.equal(authenticated.body.user.displayName, "Ada Lovelace");
    let cookies = cookieHeader(authenticated.response);
    assert.match(cookies, /accessToken=/);
    assert.match(cookies, /refreshToken=/);

    const currentUser = await request("/api/auth/me", { headers: { Cookie: cookies } });
    assert.equal(currentUser.response.status, 200, JSON.stringify(currentUser.body));
    assert.equal(currentUser.body.user.displayName, "Ada Lovelace");

    const refreshed = await request("/api/auth/refresh", { method: "POST", headers: { Cookie: cookies } });
    assert.equal(refreshed.response.status, 200);
    cookies = cookieHeader(refreshed.response, cookies);
    const loggedOut = await request("/api/auth/logout", { method: "POST", headers: { Cookie: cookies } });
    assert.equal(loggedOut.response.status, 200);
    const clearedCookies = cookieHeader(loggedOut.response, cookies);
    const afterLogout = await request("/api/auth/refresh", { method: "POST", headers: { Cookie: clearedCookies } });
    assert.equal(afterLogout.response.status, 401);
    const currentUserAfterLogout = await request("/api/auth/me", { headers: { Cookie: clearedCookies } });
    assert.equal(currentUserAfterLogout.response.status, 401);
});

test("account locks after five failed passwords", { skip: !lockoutEmail || !password }, async () => {
    for (let attempt = 1; attempt <= 5; attempt += 1) {
        const result = await post("/api/auth/login", { businessId: lockoutEmail, password: `${password}-wrong` });
        assert.equal(result.response.status, 401, JSON.stringify(result.body));
    }
    const locked = await post("/api/auth/login", { businessId: lockoutEmail, password });
    assert.equal(locked.response.status, 423, JSON.stringify(locked.body));
});