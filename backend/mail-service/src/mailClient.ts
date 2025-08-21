import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PW,
  },
});

export async function sendConfirmEmail(email, token) {
  const confirmUrl = `https://${process.env.API_HOST}/api/auth/confirm?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Please confirm your email address",
    html: `
      <p>Hi,</p>
      <p>Thanks for registering! Please confirm your email by clicking the link below:</p>
      <a href="${confirmUrl}">${confirmUrl}</a>
      <p>If you did not sign up, please ignore this email.</p>
      <p>Best,<br/>The Team</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send confirmation email to ${email}:`, error);
  }
}
