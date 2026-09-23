const { z } = require("zod");

const parseList = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);
const isProduction = process.env.NODE_ENV === "production";
const secretSchema = z.string().min(32).refine((value) => !value.startsWith("replace-with"), "must be rotated");

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(5000),
    MONGO_URI: z.string().url().or(z.string().min(1)),
    JWT_SECRET: secretSchema,
    FRONTEND_URL: z.string().min(1),
    COOKIE_DOMAIN: z.string().optional().default(""),
    REDIS_URL: z.string().optional().default(""),
    REDIS_REQUIRED: z.enum(["true", "false"]).default("false"),
    METRICS_TOKEN: z.string().min(16).optional(),
    TRUST_PROXY: z.string().optional().default("1"),
    LOG_LEVEL: z.string().optional().default("info")
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`);
}

const config = {
    ...parsed.data,
    isProduction,
    allowedOrigins: parseList(parsed.data.FRONTEND_URL),
    redisRequired: parsed.data.REDIS_REQUIRED === "true",
    trustProxy: parsed.data.TRUST_PROXY === "true" ? true : Number(parsed.data.TRUST_PROXY)
};

if (!Number.isFinite(config.trustProxy) && config.trustProxy !== true) {
    throw new Error("TRUST_PROXY must be a number or true");
}
if (isProduction) {
    if (config.allowedOrigins.some((origin) => !origin.startsWith("https://"))) {
        throw new Error("FRONTEND_URL must contain only HTTPS origins in production");
    }
    if (config.COOKIE_DOMAIN && !config.COOKIE_DOMAIN.startsWith(".")) {
        throw new Error("COOKIE_DOMAIN must begin with a dot in production");
    }
    if (!config.METRICS_TOKEN) {
        throw new Error("METRICS_TOKEN is required in production");
    }
}
if (config.redisRequired && !config.REDIS_URL) {
    throw new Error("REDIS_URL is required when REDIS_REQUIRED=true");
}

module.exports = config;