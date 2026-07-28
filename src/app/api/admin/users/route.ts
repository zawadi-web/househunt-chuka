import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role'); // 'STUDENT' | 'LANDLORD' | 'ALL'
    const search = searchParams.get('search')?.toLowerCase();
    const verificationStatus = searchParams.get('verificationStatus');

    let whereClause: any = {};

    if (role && role !== 'ALL') {
      whereClause.role = role;
    }

    if (verificationStatus && verificationStatus !== 'ALL') {
      whereClause.verificationStatus = verificationStatus;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { nationalIdNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        phoneVerified: true,
        image: true,
        role: true,
        verificationStatus: true,
        verifiedAt: true,
        nationalIdNumber: true,
        nationalIdUrlFront: true,
        nationalIdUrlBack: true,
        selfieUrl: true,
        subscriptionTier: true,
        createdAt: true,
        _count: {
          select: {
            listings: true,
            reportsFiled: true,
            reportsAgainst: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error: any) {
    console.error('[ADMIN USERS GET ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, verificationStatus, subscriptionTier } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const updateData: any = {};

    if (verificationStatus) {
      updateData.verificationStatus = verificationStatus;
      if (verificationStatus === 'VERIFIED') {
        updateData.verifiedAt = new Date();
      }
    }

    if (subscriptionTier) {
      updateData.subscriptionTier = subscriptionTier;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verificationStatus: true,
        subscriptionTier: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('[ADMIN USERS PATCH ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}
