const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Send email notification for new device/IP login
const sendNewDeviceAlert = async (userEmail, userName, ipAddress, userAgent, loginTime) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: '🔐 Новый вход в аккаунт обнаружен',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Здравствуйте, ${userName}!</h2>
        <p>Мы обнаружили вход в ваш аккаунт с нового устройства или IP-адреса.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #555;">Детали входа:</h3>
          <p><strong>IP-адрес:</strong> ${ipAddress}</p>
          <p><strong>Устройство/Браузер:</strong> ${userAgent}</p>
          <p><strong>Время:</strong> ${new Date(loginTime).toLocaleString('ru-RU')}</p>
        </div>
        
        <p>Если это были вы, можете проигнорировать это письмо.</p>
        <p style="color: #d9534f;"><strong>Если это были не вы, немедленно смените пароль!</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">
          Это автоматическое уведомление от Events Management API.<br>
          Пожалуйста, не отвечайте на это письмо.
        </p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${userEmail} about new device login`);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        // Don't throw error - email is not critical for login
        return false;
    }
};

module.exports = {
    sendNewDeviceAlert,
};
