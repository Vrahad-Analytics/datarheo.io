const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendPasswordResetEmail = async (email, resetUrl) => {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    if (!emailUser || !emailPassword || emailUser.startsWith("replace-with") || emailPassword.startsWith("replace-with")) {
        const error = new Error("Password reset email requires EMAIL_USER and EMAIL_PASSWORD");
        error.code = "EMAIL_CONFIGURATION_MISSING";
        throw error;
    }

    try {
        await transporter.sendMail({
            from: emailUser,
            to: email,
            subject: "Reset your Datarheo password",
            text: `Use this link to reset your Datarheo password. It expires in 30 minutes: ${resetUrl}`,
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Reset your Datarheo password</h2>
                    <p>Use the link below to choose a new password. This link expires in 30 minutes and can only be used once.</p>
                    <p><a href="${resetUrl}">Reset password</a></p>
                    <p>If you did not request a password reset, you can ignore this email.</p>
                </div>
            `
        });
    } catch (cause) {
        const error = new Error("Password reset email delivery failed", { cause });
        error.code = "EMAIL_DELIVERY_FAILED";
        throw error;
    }
};

const sendRegistrationVerificationEmail = async (email, verificationCode) => {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    if (!emailUser || !emailPassword || emailUser.startsWith("replace-with") || emailPassword.startsWith("replace-with")) {
        const error = new Error("Registration email verification requires EMAIL_USER and EMAIL_PASSWORD");
        error.code = "EMAIL_CONFIGURATION_MISSING";
        throw error;
    }

    try {
        await transporter.sendMail({
            from: emailUser,
            to: email,
            subject: "Verify your Datarheo email",
            text: `Your Datarheo email verification code is ${verificationCode}. It expires in 10 minutes and can only be used once.`,
            html: `<div style="font-family: Arial, sans-serif;"><h2>Verify your Datarheo email</h2><p>Enter this code to continue creating your account:</p><p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${verificationCode}</p><p>This code expires in 10 minutes and can only be used once.</p></div>`
        });
    } catch (cause) {
        const error = new Error("Registration email delivery failed", { cause });
        error.code = "EMAIL_DELIVERY_FAILED";
        throw error;
    }
};

module.exports = { sendPasswordResetEmail, sendRegistrationVerificationEmail };