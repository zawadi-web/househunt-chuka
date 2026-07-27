import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,   // giftmukhwana@gmail.com
    pass: process.env.SMTP_PASS,   // Gmail App Password (16-char)
  },
});

export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const roleLabel = role === 'LANDLORD' ? 'Landlord' : role === 'AGENT' ? 'Property Agent' : 'Student';

  await transporter.sendMail({
    from: `"HouseHunt Chuka" <${process.env.SMTP_USER}>`,
    to,
    subject: `Welcome to HouseHunt Chuka, ${name}! 🏠`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0a1628 100%); padding: 32px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: #10b981; margin: 0; font-size: 28px;">HouseHunt Chuka</h1>
          <p style="color: #94a3b8; margin: 8px 0 0; font-size: 13px;">100% Scam-Free Student Housing · Chuka University</p>
        </div>

        <h2 style="color: #0f172a; font-size: 22px; margin-bottom: 8px;">Welcome, ${name}! 🎉</h2>
        <p style="color: #475569; line-height: 1.6;">Your <strong>${roleLabel}</strong> account has been created successfully on HouseHunt Chuka — the trusted student housing platform for Chuka University students.</p>

        ${role === 'LANDLORD' || role === 'AGENT' ? `
        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <strong style="color: #92400e;">⚠️ Next Step: ID Verification Required</strong>
          <p style="color: #78350f; margin: 8px 0 0; font-size: 13px;">Before your listings go live, you must upload your National ID Front, Back, and a Live Selfie via your Landlord Dashboard. Admin review takes up to 24 hours.</p>
        </div>
        ` : `
        <div style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <strong style="color: #065f46;">✅ Ready to Find Your House!</strong>
          <p style="color: #047857; margin: 8px 0 0; font-size: 13px;">Browse 10+ verified student houses near Gate A, Gate B, Lowlands, Mungoni, and Juvera's Junction — all scam-free and physically inspected.</p>
        </div>
        `}

        <div style="text-align: center; margin: 28px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard/${role.toLowerCase()}"
            style="background: #10b981; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">
            Go to My Dashboard →
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          HouseHunt Chuka · Mariani, Tharaka Nithi County<br/>
          Support: <a href="tel:+254769047490" style="color: #10b981;">+254 769 047 490</a> · 
          <a href="mailto:giftmukhwana@gmail.com" style="color: #10b981;">giftmukhwana@gmail.com</a><br/><br/>
          <em>If you did not create this account, ignore this email.</em>
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
  await transporter.sendMail({
    from: `"HouseHunt Chuka" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset Your HouseHunt Chuka Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #0f172a;">Password Reset Request</h2>
        <p style="color: #475569;">Hi ${name}, click the button below to reset your password. This link expires in 1 hour.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetUrl}" style="background: #1e3a5f; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">If you did not request a password reset, ignore this email.</p>
      </div>
    `,
  });
}
