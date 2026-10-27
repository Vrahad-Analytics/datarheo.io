# Production checklist

## Environment

Copy `.env.example` into the deployment secret store. Set a randomly generated `JWT_SECRET` of at least 32 characters, production `NODE_ENV`, `FRONTEND_URL` to one or more HTTPS origins, and a long random `METRICS_TOKEN`. Never commit `.env` or SMTP credentials.

## HTTPS and cookies

Terminate TLS at the load balancer or hosting platform for `datarheo.io`, `app.datarheo.io`, and `api.datarheo.io`. Set `TRUST_PROXY` to the number of trusted proxy hops. Production cookies are `HttpOnly`, `Secure`, and `SameSite=Strict`. For the marketing-site login at `datarheo.io` to establish a session usable by the workspace at `app.datarheo.io`, set `COOKIE_DOMAIN=.datarheo.io` in the backend environment. Keep it empty for local development.

Set `FRONTEND_URL` to the frontend origins that call the API, for example `FRONTEND_URL=https://datarheo.io`. The workspace origin `https://app.datarheo.io` is always allowed by the backend. The workspace must request `GET https://api.datarheo.io/api/auth/me` with `credentials: "include"` (or `fetch(..., { credentials: "include" })`), so the session cookie is sent. Render `response.user.displayName` (or combine `firstName` and `lastName`) in its home-page welcome/header. The access cookie is HttpOnly by design; the app must not try to read it from JavaScript or local storage.

Password recovery uses `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`. Configure `EMAIL_USER` and `EMAIL_PASSWORD` for the existing Gmail SMTP sender, and set `RESET_PASSWORD_URL` to the frontend's reset page. Production defaults to `https://datarheo.io/reset-password`; local Node development defaults to `http://localhost:5173/reset-password`, while Docker Compose defaults to `http://localhost/reset-password` (served through Caddy). The reset page must be deployed at this URL; do not point it at the separate workspace app unless that app serves this route. Reset links expire after 30 minutes, can be used once, and password changes revoke active refresh sessions.

For local testing with Docker Compose, start the stack with `docker compose up --build`, open `http://localhost/reset-password` to verify the form, and use the forgot-password form to send yourself a new link. For Vite running directly on the host, keep `RESET_PASSWORD_URL=http://localhost:5173/reset-password` in `Backend/.env`. Recreate/restart the backend after changing this setting. Do not reuse production reset links for local testing.

When running with Docker Compose, the backend loads these mail settings from `Backend/.env`. Recreate the backend container after changing the file so the running process receives the updated credentials. Keep `.env` files out of source control and container images.

## CORS and scaling

`FRONTEND_URL` is the complete CORS allowlist. The backend rejects non-HTTPS origins in production. Set `REDIS_URL` and `REDIS_REQUIRED=true` when running multiple backend instances so rate limits are shared; a missing Redis URL otherwise uses per-instance limits and emits a warning.

## Monitoring and tests

Probe `/health/live` for process liveness and `/health/ready` for Mongo readiness. Scrape `/metrics` with `Authorization: Bearer $METRICS_TOKEN` and alert on `datarheo_server_errors_total`, `datarheo_auth_failures_total`, readiness failures, and repeated Redis/Mongo connection errors. Run the integration suite against a disposable database with `TEST_BASE_URL`, `TEST_BUSINESS_EMAIL`, `TEST_PASSWORD`, and optionally `TEST_LOCKOUT_EMAIL`:

```text
npm run test:auth
```

The suite covers registration, invalid and valid MFA, password setup, login, password reset, refresh, logout, post-logout refresh rejection, and account lockout.