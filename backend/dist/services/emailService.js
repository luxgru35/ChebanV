"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNewDeviceAlert = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendNewDeviceAlert = async (userEmail, userName, ipAddress, userAgent, loginTime) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Events App" <no-reply@example.com>',
        to: userEmail,
        subject: 'Security Alert: New Device Login',
        html: `
      <h2>New Login Detected</h2>
      <p>Hello ${userName},</p>
      <p>We detected a login to your account from a new device or IP address.</p>
      <ul>
        <li><strong>Time:</strong> ${loginTime.toLocaleString()}</li>
        <li><strong>IP Address:</strong> ${ipAddress}</li>
        <li><strong>Device:</strong> ${userAgent}</li>
      </ul>
      <p>If this was you, you can ignore this email. If not, please contact support immediately.</p>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${userEmail} about new device login`);
        return true;
    }
    catch (error) {
        console.error('❌ Error sending email:', error.message);
        return false;
    }
};
exports.sendNewDeviceAlert = sendNewDeviceAlert;
