const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const Redis = require("ioredis");
const config = require("../config/env");
const logger = require("../utils/logger");

const redis = config.REDIS_URL ? new Redis(config.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 2 }) : null;
let redisReady = false;

if (redis && config.redisRequired) redis.on("error", (error) => logger.error({ err: error }, "Redis connection error"));

const connectRedis = async () => {
    if (!redis || redisReady) return;
    try {
        await redis.connect();
        await redis.ping();
        redisReady = true;
    } catch (error) {
        redisReady = false;
        if (config.redisRequired) throw error;
        redis.disconnect();
    }
};

const createLimiter = (limit, message, prefix, useRedis) => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ...(useRedis ? {
        store: new RedisStore({
            sendCommand: (...args) => redis.call(...args),
            prefix
        })
    } : {}),
    message: { message }
});

const createAdaptiveLimiter = (limit, message, prefix) => {
    const memoryLimiter = createLimiter(limit, message, prefix, false);
    let redisLimiter;
    return (req, res, next) => {
        if (!redisReady) return memoryLimiter(req, res, next);
        redisLimiter ||= createLimiter(limit, message, prefix, true);
        return redisLimiter(req, res, next);
    };
};

module.exports = {
    loginLimiter: createAdaptiveLimiter(10, "Too many login attempts. Please try again later.", "datarheo:login:"),
    registrationLimiter: createAdaptiveLimiter(20, "Too many registration attempts. Please try again later.", "datarheo:registration:"),
    getRedisStatus: () => ({ configured: Boolean(redis), status: redisReady ? "ready" : redis ? "unavailable" : "disabled" }),
    connectRedis,
    closeRedis: async () => {
        if (redis?.status === "ready") await redis.quit();
        else redis?.disconnect();
        redisReady = false;
    }
};