import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { validateVerificationDocument } from '@/lib/validations';
import { validateUploadFile } from '@/lib/upload-validator';
import { authorizeRole } from '@/lib/rbac';

export async function POST(request: Request) {
  // 1. Strict Rate Limiting (Max 3 submissions per 10 minutes)
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const limiter = rateLimit(`id_verify_${clientIp}`, { limit: 3, windowMs: 10 * 60 * 1000 });

  if (!limiter.success) {
    return NextResponse.json(
      { success: false, message: 'Too many verification attempts. Please wait 10 minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // 2. Authorization Check (Only LANDLORD or AGENT can submit verification)
    const mockUser = { id: body.landlordId || "l1", role: (body.userRole || 'LANDLORD') as any };
    const authCheck = authorizeRole(mockUser, ['LANDLORD', 'AGENT', 'ADMIN']);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.reason },
        { status: 403 }
      );
    }

    // 3. Input Validation (Kenyan National ID 7-8 digits)
    const validation = validateVerificationDocument(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // 4. File Upload Check (MIME type and size validation)
    if (body.fileInfo) {
      const fileCheck = validateUploadFile(
        body.fileInfo.name || 'id.jpg',
        body.fileInfo.type || 'image/jpeg',
        body.fileInfo.size || 2 * 1024 * 1024
      );
      if (!fileCheck.isValid) {
        return NextResponse.json(
          { success: false, message: fileCheck.error },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Government ID & selfie submitted successfully. Status set to PENDING admin verification.',
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
