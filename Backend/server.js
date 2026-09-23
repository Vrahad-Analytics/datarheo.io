require("dotenv").config();

const config = require("./config/env");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const pinoHttp = require("pino-http");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const logger = require("./utils/logger");
const metrics = require("./utils/metrics");
const { getRedisStatus, connectRedis, closeRedis } = require("./middleware/rateLimiters");

const app = express();

app.set("trust proxy", config.trustProxy);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || config.allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
app.use(helmet());
app.use(pinoHttp({ logger }));
app.use((req, res, next) => {
    metrics.increment("requests");
    res.on("finish", () => {
        if (res.statusCode >= 500) metrics.increment("server_errors");
        if (res.statusCode === 401 || res.statusCode === 423) metrics.increment("auth_failures");
    });
    next();
});
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use("/api/auth", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

app.get("/health/live", (req, res) => res.json({ status: "ok" }));
app.get("/health", (req, res) => {
    const ready = mongoose.connection.readyState === 1;
    return res.status(ready ? 200 : 503).json({ status: ready ? "ok" : "unavailable" });
});
app.get("/health/ready", (req, res) => {
    const ready = mongoose.connection.readyState === 1;
    const redis = getRedisStatus();
    const redisReady = !config.redisRequired || redis.status === "ready";
    const available = ready && redisReady;
    return res.status(available ? 200 : 503).json({ status: available ? "ok" : "unavailable", mongo: ready ? "ready" : "unavailable", redis });
});
app.get("/metrics", (req, res) => {
    if (!config.METRICS_TOKEN || req.get("authorization") !== `Bearer ${config.METRICS_TOKEN}`) {
        return res.status(404).end();
    }
    res.type("text/plain").send(metrics.prometheus());
});

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Datarheo backend is running"
    });
});

app.use((req, res) => res.status(404).json({ message: "Not found" }));

app.use((error, req, res, next) => {
    logger.warn({ err: error }, "Request rejected");
    if (res.headersSent) return next(error);
    return res.status(400).json({ message: "Request could not be processed" });
});

const start = async () => {
    await connectDB();
    await connectRedis();
    const server = app.listen(config.PORT, () => logger.info({ port: config.PORT }, "Server listening"));
    const shutdown = async (signal) => {
        logger.info({ signal }, "Shutdown requested");
        server.close(async () => {
            await closeRedis();
            await mongoose.connection.close(false);
            process.exit(0);
        });
    };
    process.once("SIGTERM", shutdown);
    process.once("SIGINT", shutdown);
    return server;
};

if (require.main === module) start().catch(() => process.exit(1));

module.exports = { app, start };