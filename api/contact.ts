import type { IncomingMessage, ServerResponse } from 'http';
import nodemailer from 'nodemailer';

interface ContactRequestBody {
  name?: string;
  Full_Name?: string;
  firstName?: string;
  email?: string;
  Email_Address?: string;
  phone?: string;
  Telephone_Number?: string;
  company?: string;
  company_name?: string;
  country?: string;
  subject?: string;
  service?: string;
  message?: string;
  Your_Message?: string;
  _hp_company?: string;
  website_url?: string;
  website?: string;
  bot_trap?: string;
}

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse & {
    status?: (code: number) => any;
    json?: (body: any) => any;
  }
) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Accept');

  const sendJson = (status: number, body: any) => {
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(status).json(body);
    }
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(body));
  };

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return sendJson(405, { ok: false, success: false, message: 'Method Not Allowed' });
  }

  // Parse body safely
  let data: ContactRequestBody = {};
  if (req.body) {
    data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } else {
    data = await new Promise<ContactRequestBody>((resolve) => {
      let bodyStr = '';
      const timer = setTimeout(() => resolve({}), 800);
      req.on('data', (chunk) => {
        bodyStr += chunk;
      });
      req.on('end', () => {
        clearTimeout(timer);
        try {
          resolve(bodyStr ? JSON.parse(bodyStr) : {});
        } catch {
          resolve({});
        }
      });
      req.on('error', () => {
        clearTimeout(timer);
        resolve({});
      });
    });
  }

  const name = (data.name || data.Full_Name || data.firstName || '').trim();
  const email = (data.email || data.Email_Address || '').trim();
  const phone = (data.phone || data.Telephone_Number || '').trim();
  const company = (data.company || data.company_name || '').trim();
  const country = (data.country || '').trim();
  const subject = (data.subject || data.service || 'General Inquiry').trim();
  const message = (data.message || data.Your_Message || '').trim();
  const honeypot = (data._hp_company || data.website_url || data.website || data.bot_trap || '').trim();

  const submissionId = 'CNT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const submittedAt = new Date().toISOString();

  // 1. Honeypot check
  if (honeypot) {
    return sendJson(200, {
      ok: true,
      success: true,
      id: submissionId,
      submittedAt,
      message: 'Thank you! Your inquiry has been received successfully.',
    });
  }

  // 2. Field Validations
  if (name.length < 2) {
    return sendJson(400, {
      ok: false,
      success: false,
      field: 'name',
      message: 'Please enter your full name (at least 2 characters).',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return sendJson(400, {
      ok: false,
      success: false,
      field: 'email',
      message: 'Please enter a valid work email address.',
    });
  }

  if (phone && !/^[+]?[\d\s\-()]{7,20}$/.test(phone)) {
    return sendJson(400, {
      ok: false,
      success: false,
      field: 'phone',
      message: 'Please enter a valid phone number (7 to 20 digits).',
    });
  }

  if (message.length < 10) {
    return sendJson(400, {
      ok: false,
      success: false,
      field: 'message',
      message: 'Please write a message of at least 10 characters.',
    });
  }

  // 3. Dispatch Email via SMTP
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER || 'p25339633@gmail.com';
  const smtpPass = (process.env.SMTP_PASSWORD || 'hfqkvggjtdwsddqf').replace(/\s+/g, '');
  const adminEmail = process.env.CONTACT_EMAIL_TO || 'p25339633@gmail.com';

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"Apokrin Enterprise" <${smtpUser}>`,
      to: adminEmail,
      replyTo: email,
      subject: `New Inquiry [${submissionId}]: ${company ? company + ' — ' : ''}${name} (${subject})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-top: 0; font-size: 20px;">New Inquiry Received — Apokrin Website</h2>
          <p style="color: #64748b; font-size: 13px;">Reference ID: <strong>${submissionId}</strong> | ${submittedAt}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p><strong>Full Name:</strong> ${name}</p>
          <p><strong>Work Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
          <p><strong>Telephone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Country:</strong> ${country || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f8fafc; padding: 14px; border-radius: 6px; border-left: 4px solid #2563eb; margin-top: 8px; line-height: 1.5;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `,
    });
  } catch (err: any) {
    console.error('[Vercel Contact API] SMTP Error:', err?.message || err);
  }

  // Return success
  return sendJson(200, {
    ok: true,
    success: true,
    id: submissionId,
    submittedAt,
    message: 'Thank you! Your inquiry has been received successfully. Our team will contact you shortly.',
  });
}
