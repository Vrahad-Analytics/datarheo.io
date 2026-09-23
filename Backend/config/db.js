const mongoose = require("mongoose");
const logger = require("../utils/logger");

mongoose.set("strictQuery", true);

const connectDB = async () => {
    try {
               await mongoose.connect(process.env.MONGO_URI, {
                    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 20),
                    minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE || 2),
            retryWrites: true,
            w: "majority",
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
         });
         const actualDB = mongoose.connection.name;
         logger.info({ database: actualDB }, "MongoDB connected");
         mongoose.connection.on("error", (error) => logger.error({ err: error }, "MongoDB connection error"));
         mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
         mongoose.connection.on("reconnected", () => logger.info("MongoDB reconnected"));
         return mongoose.connection;
    } catch (error) {
         logger.error({ err: error }, "MongoDB connection failed");
         throw error;
    }
};
module.exports = connectDB;