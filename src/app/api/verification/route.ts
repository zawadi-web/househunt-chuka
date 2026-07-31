import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { validateVerificationDocument } from '@/lib/validations';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  // 1. Strict Rate Limiting (Max 5 submissions per 10 minutes)
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const limiter = rateLimit(`id_verify_${clientIp}`, { limit: 5, windowMs: 10 * 60 * 1000 });

  if (!limiter.success) {
    return NextResponse.json(
      { success: false, message: 'Too many verification attempts. Please wait 10 minutes.' },
      { status: 429 }
    );
  }

  try {
    const session = await auth();
    const sessionUser = session?.user as any;
    const body = await request.json();

    const targetUserId = sessionUser?.id || body.landlordId || body.userId;

    if (!targetUserId && !body.email) {
      return NextResponse.json(
        { success: false, message: 'User identification required. Please log in or provide user details.' },
        { status: 400 }
      );
    }

    // Input Validation (Kenyan National ID 7-8 digits)
    const validation = validateVerificationDocument(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const nationalIdUrlFront = body.nationalIdUrlFront || body.idFrontPreview;
    const nationalIdUrlBack = body.nationalIdUrlBack || body.idBackPreview;
    const selfieUrl = body.selfieUrl || body.selfiePreview;

    if (!nationalIdUrlFront || !selfieUrl) {
      return NextResponse.json(
        { success: false, message: 'Both National ID image and selfie photo are required.' },
        { status: 400 }
      );
    }

    // Persist to PostgreSQL via Prisma
    const updatedUser = targetUserId
      ? await prisma.user.update({
          where: { id: targetUserId },
          data: {
            nationalIdNumber: body.nationalIdNumber,
            nationalIdUrlFront,
            nationalIdUrlBack: nationalIdUrlBack || null,
            selfieUrl,
            verificationStatus: 'PENDING',
          },
        })
      : await prisma.user.update({
          where: { email: body.email },
          data: {
            nationalIdNumber: body.nationalIdNumber,
            nationalIdUrlFront,
            nationalIdUrlBack: nationalIdUrlBack || null,
            selfieUrl,
            verificationStatus: 'PENDING',
          },
        });

    return NextResponse.json({
      success: true,
      message: 'Government ID & selfie submitted successfully. Status set to PENDING admin verification.',
      status: 'PENDING',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        verificationStatus: updatedUser.verificationStatus,
      },
      submittedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[VERIFICATION API ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record verification documents. Please try again.' },
      { status: 500 }
    );
  }
}

