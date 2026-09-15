const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Datarheo Email Verification OTP",

        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Datarheo Email Verification</h2>

                <p>Your OTP for account verification is:</p>

                <h1>${otp}</h1>

                <p>This OTP will expire in 10 minutes.</p>

                <p>If you did not create this account, please ignore this email.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;