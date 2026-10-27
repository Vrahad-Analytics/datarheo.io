process.env.MONGO_URI ||= "mongodb://127.0.0.1:27017/datarheo-test";
process.env.JWT_SECRET ||= "cors-unit-test-secret-at-least-32-characters";
process.env.FRONTEND_URL ||= "http://localhost:5173";

const test = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");
const { app } = require("../server");

test("workspace origin is allowed to make credentialed auth requests", async () => {
    const server = app.listen(0);
    await once(server, "listening");

    try {
        const { port } = server.address();
        const response = await fetch(`http://127.0.0.1:${port}/api/auth/me`, {
            method: "OPTIONS",
            headers: {
                Origin: "https://app.datarheo.io",
                "Access-Control-Request-Method": "GET",
                Connection: "close"
            }
        });

        assert.equal(response.status, 204);
        assert.equal(response.headers.get("access-control-allow-origin"), "https://app.datarheo.io");
        assert.equal(response.headers.get("access-control-allow-credentials"), "true");
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        });
    }
});
