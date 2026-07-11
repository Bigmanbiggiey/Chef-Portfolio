import nodemailer from 'nodemailer';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO_EMAIL = 'meshackmashua@gmail.com';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, email, message, honeypot } = payload;

  // Bots fill hidden fields; pretend success without sending anything.
  if (honeypot) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  if (
    typeof name !== 'string' || name.trim().length === 0 || name.length > 100 ||
    typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 200 ||
    typeof message !== 'string' || message.trim().length === 0 || message.length > 5000
  ) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Please fill in all fields with valid values.' }) };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Chef Mashua Website" <${process.env.SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New website inquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch {
    return { statusCode: 502, body: JSON.stringify({ error: 'Failed to send email.' }) };
  }
};
