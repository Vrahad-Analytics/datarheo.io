const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const Redis = require("ioredis");
const config = require("../config/env");
const logger = require("../utils/logger");

const redis = config.REDIS_URL ? new Redis(config.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 2 }) : null;
const store = redis ? new RedisStore({ sendCommand: (...args) => redis.call(...args) }) : undefined;

if (!redis && config.isProduction) logger.warn("REDIS_URL is not configured; rate limits are local to this instance");
if (redis) redis.on("error", (error) => logger.error({ err: error }, "Redis connection error"));

const connectRedis = async () => {
    if (!redis || redis.status === "ready") return;
    await redis.connect();
    await redis.ping();
};

const createLimiter = (limit, message) => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    store,
    message: { message }
});

module.exports = {
    loginLimiter: createLimiter(10, "Too many login attempts. Please try again later."),
    registrationLimiter: createLimiter(20, "Too many registration attempts. Please try again later."),
    getRedisStatus: () => ({ configured: Boolean(redis), status: redis?.status || "disabled" }),
    connectRedis,
    closeRedis: async () => redis?.quit()
};