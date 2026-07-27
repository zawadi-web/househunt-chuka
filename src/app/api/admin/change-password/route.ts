import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    const adminHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminHash) {
      return NextResponse.json({ error: 'Admin not configured.' }, { status: 500 });
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, adminHash);
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 12);

    // Update .env file in production this would be a secrets manager,
    // but for Vercel we return the new hash so admin can paste it in Vercel dashboard
    return NextResponse.json({
      success: true,
      newHash,
      message: 'Copy this new hash and update ADMIN_PASSWORD_HASH in your Vercel environment variables.',
    });
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
