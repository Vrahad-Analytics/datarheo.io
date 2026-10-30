const mongoose = require("mongoose");

const authSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        sessionId: {
            type: String,
            required: true,
            unique: true
        },
        refreshTokenHash: {
            type: String,
            required: true,
            unique: true,
            select: false
        },
        handoffHash: {
            type: String,
            select: false
        },
        handoffExpiresAt: {
            type: Date,
            select: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("AuthSession", authSessionSchema);
