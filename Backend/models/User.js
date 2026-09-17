const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: false,
            trim: true
        },

        lastName: {
            type: String,
            required: false,
            trim: true
        },

        businessId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        email: {
            type: String,
            required: false,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: false
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        otp: {
            type: String,
            default: null
        },

        otpExpires: {
            type: Date,
            default: null
        },

        otpVerified: {
            type: Boolean,
            default: false
        },

        authenticatorSecret: {
            type: String,
            select: false,
            default: null
        },

        authenticatorVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);