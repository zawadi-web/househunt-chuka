import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { validateEmail, sanitizeText } from '@/lib/validations';
import { sendWelcomeEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  // Rate limit: max 10 registrations per 10 min per IP
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const limiter = rateLimit(`register_${ip}`, { limit: 10, windowMs: 10 * 60 * 1000 });
  if (!limiter.success) {
    return NextResponse.json({ error: 'Too many registration attempts. Please wait 10 minutes.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { name, email, password, role = 'STUDENT', phone, nationalId } = body;

    // ─── Validation ────────────────────────────────────────────
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Full name is required (min 2 characters)' }, { status: 400 });
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (!['STUDENT', 'LANDLORD', 'AGENT'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role selected' }, { status: 400 });
    }
    if ((role === 'LANDLORD' || role === 'AGENT') && (!nationalId || nationalId.trim().length < 6)) {
      return NextResponse.json({ error: 'Kenyan National ID number is required for landlords (min 6 digits)' }, { status: 400 });
    }

    // ─── Duplicate email check ─────────────────────────────────
    const existingEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingEmail) {
      return NextResponse.json({ error: 'An account with this email address already exists. Please sign in.' }, { status: 409 });
    }

    // ─── Duplicate phone check ─────────────────────────────────
    if (phone && phone.trim()) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone: phone.trim() },
      });
      if (existingPhone) {
        return NextResponse.json({ error: 'An account with this phone number already exists. Please sign in.' }, { status: 409 });
      }
    }

    // ─── Hash password ─────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12);

    // ─── Create user ───────────────────────────────────────────
    const user = await prisma.user.create({
      data: {
        name: sanitizeText(name.trim()),
        email: email.toLowerCase().trim(),
        passwordHash,
        phone: phone?.trim() || null,
        nationalIdNumber: nationalId ? nationalId.trim() : null,
        role,
        verificationStatus: 'UNVERIFIED',
      },
      select: { id: true, name: true, email: true, role: true },
    });

    // ─── Send welcome email (Non-blocking) ────────────────────
    try {
      await sendWelcomeEmail(user.email, user.name, role);
    } catch (emailErr) {
      console.error('[WELCOME EMAIL FAILED]', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: `Account created! Welcome to HouseHunt Chuka, ${user.name}.`,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error: any) {
    console.error('[REGISTER ERROR]', error);
    if (error?.code === 'P2002') {
      const targetField = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : 'email/phone';
      return NextResponse.json({ error: `An account with this ${targetField} already exists.` }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || 'Registration failed. Please try again.' }, { status: 500 });
  }
}
