const nodemailer = require('nodemailer');
const RESEND_REQUEST_TIMEOUT_MS = Number(process.env.RESEND_REQUEST_TIMEOUT_MS || 5000);

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined in environment variables`);
  }
  return value;
}

function createTransport() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = getRequiredEnv('SMTP_USER');
  const pass = getRequiredEnv('SMTP_PASS');
  const secure = String(process.env.SMTP_SECURE ?? (port === 465)).toLowerCase() === 'true';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function sendWithSmtp({ to, subject, text, html, from }) {
  const transporter = createTransport();
  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
}

async function sendWithResend({ to, subject, text, html, from }) {
  const apiKey = getRequiredEnv('RESEND_API_KEY');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), RESEND_REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        ...(html ? { html } : {}),
        ...(text ? { text } : {})
      })
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Resend request timed out');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const rawBody = await response.text();
    throw new Error(`Resend API error (${response.status}): ${rawBody}`);
  }

  return response.json();
}

async function sendMail({ to, subject, text, html }) {
  const from = process.env.RESEND_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!from) {
    throw new Error('RESEND_FROM/SMTP_FROM/SMTP_USER is not defined in environment variables');
  }

  if (process.env.RESEND_API_KEY) {
    try {
      return await sendWithResend({ to, subject, text, html, from });
    } catch (resendError) {
      if (!hasSmtpConfig()) {
        throw resendError;
      }
      return sendWithSmtp({ to, subject, text, html, from: process.env.SMTP_FROM || process.env.SMTP_USER });
    }
  }

  return sendWithSmtp({ to, subject, text, html, from: process.env.SMTP_FROM || process.env.SMTP_USER });
}

module.exports = { sendMail };

