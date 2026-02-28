import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true,
    auth: { user: process.env.SMTP_MAIL, pass: process.env.SMTP_PASSWORD },
    tls: { rejectUnauthorized: false },
  });
  await transporter.sendMail({ from: process.env.SMTP_MAIL, to: email, subject, html: message });
};
