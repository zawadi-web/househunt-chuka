import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userSession = session?.user as any;

    if (!userSession?.id && !userSession?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userSession.id ? [{ id: userSession.id }] : []),
          ...(userSession.email ? [{ email: userSession.email }] : []),
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        verificationStatus: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
  }
}
