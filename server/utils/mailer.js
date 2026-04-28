const nodemailer = require('nodemailer');

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

async function sendMail({ to, subject, text, html }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!from) {
    throw new Error('SMTP_FROM/SMTP_USER is not defined in environment variables');
  }

  const transporter = createTransport();
  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
}

module.exports = { sendMail };

