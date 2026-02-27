import nodemailer from 'nodemailer';

interface SendOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmailSMTP(opts: SendOptions) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';

  if (!host || !user || !pass) {
    throw new Error('Missing SMTP configuration');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const from = opts.from || process.env.RECEIPT_FROM_EMAIL || user;

  const info = await transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  return info;
}
