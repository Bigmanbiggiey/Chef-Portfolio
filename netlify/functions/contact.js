import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO_EMAIL = 'meshackmashua@gmail.com';

// Server-only client using the service_role key, which bypasses RLS —
// this is intentional (see supabase/schema.sql): the `inquiries` table has
// no insert policy for the public anon key, so logging can only happen
// from here. SUPABASE_SERVICE_ROLE_KEY must NEVER get a VITE_ prefix —
// that would bundle it into client-side JS and hand out full database access.
function getSupabaseAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

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

  const { name, email, message, honeypot, source } = payload;
  const inquirySource = source === 'availability' ? 'availability' : 'contact';

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

    // Best-effort: the email is the critical path (already sent above), so a
    // logging failure here shouldn't turn into an error for the visitor.
    const supabaseAdmin = getSupabaseAdmin();
    if (supabaseAdmin) {
      try {
        const { error: logError } = await supabaseAdmin
          .from('inquiries')
          .insert({ name, email, message, source: inquirySource });
        if (logError) console.error('Failed to log inquiry:', logError.message);
      } catch (logErr) {
        console.error('Failed to log inquiry:', logErr);
      }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch {
    return { statusCode: 502, body: JSON.stringify({ error: 'Failed to send email.' }) };
  }
};
