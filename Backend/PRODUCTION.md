# Production checklist

## Environment

Copy `.env.example` into the deployment secret store. Set a randomly generated `JWT_SECRET` of at least 32 characters, production `NODE_ENV`, `FRONTEND_URL` to one or more HTTPS origins, and a long random `METRICS_TOKEN`. Configure `EMAIL_USER` and `EMAIL_PASSWORD` because registration now verifies business-email ownership before authenticator enrollment. Never commit `.env` or SMTP credentials.

## HTTPS and cookies

Terminate TLS at the load balancer or hosting platform for `datarheo.io`, `app.datarheo.io`, `api.datarheo.io`, and `api.app.datarheo.io`. Set `TRUST_PROXY` to the number of trusted proxy hops. Production cookies are `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/`, and `Domain=.datarheo.io`. The backend rejects production startup unless `COOKIE_DOMAIN=.datarheo.io`; keep it empty for local development.

Set `FRONTEND_URL` to the marketing frontend origins that call the auth API, for example `FRONTEND_URL=https://datarheo.io`. The workspace origin `https://app.datarheo.io` is also allowed by the auth backend. The workspace checks `GET https://api.datarheo.io/api/auth/me` and refreshes through `/api/auth/refresh` with `credentials: "include"`; its backend independently introspects the cookie against the auth API on every private request. The access cookie is HttpOnly; neither site should read it from JavaScript or local storage. Login accepts a `returnTo` URL only for `https://app.datarheo.io` (or loopback HTTP during development).

Configure the workspace backend with `AUTH_API_BASE_URL=https://api.datarheo.io` (the production default). Its `CORS_ALLOWED_ORIGINS` must include exactly `https://app.datarheo.io`; this setting also gates state-changing workspace API requests. The marketing auth API must keep `https://app.datarheo.io` in its CORS allowlist. Do not configure bearer tokens in browser storage or duplicate the login system.

Connection and settings records are scoped to the authenticated user. Older connection and settings documents without `user_id` are intentionally inaccessible rather than assigned to a user automatically; back up the database and perform an explicit, reviewed ownership migration before deploying if legacy data must be retained. Runs inherit their connection owner.

Password recovery uses `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`. Set `RESET_PASSWORD_URL` to the frontend's reset page. Production defaults to `https://datarheo.io/reset-password`; local Node development defaults to `http://localhost:5173/reset-password`, while Docker Compose defaults to `http://localhost/reset-password` (served through Caddy). The reset page must be deployed at this URL; do not point it at the separate workspace app unless that app serves this route. Reset links expire after 30 minutes, can be used once, and password changes revoke active sessions. Logout revokes the active session ID, so the existing access token is rejected immediately as well as the refresh token.

For local testing with Docker Compose, start the stack with `docker compose up --build`, open `http://localhost/reset-password` to verify the form, and use the forgot-password form to send yourself a new link. For Vite running directly on the host, keep `RESET_PASSWORD_URL=http://localhost:5173/reset-password` in `Backend/.env`. Recreate/restart the backend after changing this setting. Do not reuse production reset links for local testing.

When running with Docker Compose, the backend loads these mail settings from `Backend/.env`. Recreate the backend container after changing the file so the running process receives the updated credentials. Keep `.env` files out of source control and container images.

## Cross-subdomain authentication verification

For local development, set `COOKIE_DOMAIN=` (empty), `FRONTEND_URL=http://localhost:5173`, and `AUTH_API_BASE_URL=http://localhost:5000`. Start the auth API on port 5000, the workspace API on port 8000, the marketing frontend on port 5173, and the workspace Vite frontend on port 3000. The browser treats the loopback ports as one cookie host; the configured CORS allowlists permit those development origins.

1. Open the marketing site's registration page, register with a mailbox you can access, enter the emailed 6-digit code, enroll an authenticator, and set a password. Registration must not return an authenticator QR code before the email code is verified.
2. Open `https://app.datarheo.io` (or `http://localhost:3000`) in a private browser window. It should show only a session-check screen, then navigate to `https://datarheo.io/login?returnTo=...` (or the local marketing login) without rendering dashboard content.
3. Sign in through the marketing login, complete MFA, and verify that the browser returns to the preserved app destination. Reload the app; the dashboard should remain accessible with the HttpOnly cookies.
4. Sign out from the app. Reopen/refresh the app and confirm it returns to login. A request such as `curl -i https://api.app.datarheo.io/api/syncs` without cookies should return `401`; a logged-out browser must receive `401` from the API even if it still presents an old access token.
5. To verify refresh/expiry behavior, expire or revoke the session in a test environment and reopen the app. A still-valid refresh session may be renewed; once both tokens are invalid, the app must redirect to login and private APIs must return `401`.
6. With two separate verified users, create a connection as the first user and request its ID using the second user's session. The API should return `403`, while an unknown ID returns `404`; list, credentials, runs, logs, settings, and mutations must remain user-scoped.
7. As an authenticated user, create and run a test connection, inspect its logs, edit it, and delete it to confirm existing dashboard and sync operations still function.

The local/production browser, DNS, TLS, reverse-proxy, and actual SMTP delivery paths are deployment-dependent and must be checked in the target environment.

## CORS and scaling

`FRONTEND_URL` is the complete CORS allowlist. The backend rejects non-HTTPS origins in production. Set `REDIS_URL` and `REDIS_REQUIRED=true` when running multiple backend instances so rate limits are shared; if Redis is not required, a missing or unavailable Redis URL uses per-instance in-memory limits and emits a warning. When Redis is required, a connection failure is logged and prevents startup.

## Monitoring and tests

Probe `/health/live` for process liveness and `/health/ready` for Mongo readiness. Scrape `/metrics` with `Authorization: Bearer $METRICS_TOKEN` and alert on `datarheo_server_errors_total`, `datarheo_auth_failures_total`, readiness failures, and repeated Redis/Mongo connection errors. Run the integration suite against a disposable database with `TEST_BASE_URL`, `TEST_BUSINESS_EMAIL`, `TEST_PASSWORD`, and optionally `TEST_LOCKOUT_EMAIL`:

```text
npm run test:auth
```

The suite covers registration, invalid and valid MFA, password setup, login, password reset, refresh, logout, post-logout refresh rejection, and account lockout.