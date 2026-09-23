# Production checklist

## Environment

Copy `.env.example` into the deployment secret store. Set a randomly generated `JWT_SECRET` of at least 32 characters, production `NODE_ENV`, `FRONTEND_URL` to one or more HTTPS origins, and a long random `METRICS_TOKEN`. Never commit `.env` or SMTP credentials.

## HTTPS and cookies

Terminate TLS at the load balancer or hosting platform for both `app.datarheo.io` and `api.datarheo.io`. Set `TRUST_PROXY` to the number of trusted proxy hops. Production cookies are `HttpOnly`, `Secure`, and `SameSite=Strict`; leave `COOKIE_DOMAIN` empty unless a shared parent-domain cookie is specifically required.

## CORS and scaling

`FRONTEND_URL` is the complete CORS allowlist. The backend rejects non-HTTPS origins in production. Set `REDIS_URL` and `REDIS_REQUIRED=true` when running multiple backend instances so rate limits are shared; a missing Redis URL otherwise uses per-instance limits and emits a warning.

## Monitoring and tests

Probe `/health/live` for process liveness and `/health/ready` for Mongo readiness. Scrape `/metrics` with `Authorization: Bearer $METRICS_TOKEN` and alert on `datarheo_server_errors_total`, `datarheo_auth_failures_total`, readiness failures, and repeated Redis/Mongo connection errors. Run the integration suite against a disposable database with `TEST_BASE_URL`, `TEST_BUSINESS_EMAIL`, `TEST_PASSWORD`, and optionally `TEST_LOCKOUT_EMAIL`:

```text
npm run test:auth
```

The suite covers registration, invalid and valid MFA, password setup, login, invalid MFA, refresh, logout, post-logout refresh rejection, and account lockout.