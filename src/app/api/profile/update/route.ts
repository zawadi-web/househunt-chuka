import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userSession = session?.user as any;

    if (!userSession?.id) {
      return NextResponse.json({ error: 'Unauthorized — please log in first.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, image, course } = body;

    // Validate name
    if (name && (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100)) {
      return NextResponse.json({ error: 'Name must be between 2 and 100 characters.' }, { status: 400 });
    }

    // Validate phone (Kenya format)
    if (phone) {
      const phoneRegex = /^(\+254|07|01)\d{8,9}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return NextResponse.json({ error: 'Enter a valid Kenyan phone number.' }, { status: 400 });
      }
    }

    // Build update payload
    const updateData: any = {
      updatedAt: new Date(),
    };
    if (name?.trim()) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (image) updateData.image = image; // base64 or URL

    const updatedUser = await prisma.user.update({
      where: { id: userSession.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        verificationStatus: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Phone number already in use by another account.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update profile. Please try again.' }, { status: 500 });
  }
}
