import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();

    let whereClause: any = {};

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { areaName: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const houses = await prisma.house.findMany({
      where: whereClause,
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            verificationStatus: true,
            subscriptionTier: true,
          },
        },
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: houses.length, houses });
  } catch (error: any) {
    console.error('[ADMIN HOUSES GET ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch house listings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { houseId, status, rejectionReason } = body;

    if (!houseId) {
      return NextResponse.json({ success: false, error: 'House ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (status === 'APPROVED') updateData.lastVerifiedAt = new Date();
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;

    const updatedHouse = await prisma.house.update({
      where: { id: houseId },
      data: updateData,
    });

    return NextResponse.json({ success: true, house: updatedHouse });
  } catch (error: any) {
    console.error('[ADMIN HOUSES PATCH ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to update house status' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const houseId = searchParams.get('houseId');

    if (!houseId) {
      return NextResponse.json({ success: false, error: 'House ID is required' }, { status: 400 });
    }

    await prisma.house.delete({
      where: { id: houseId },
    });

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error: any) {
    console.error('[ADMIN HOUSES DELETE ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete listing' }, { status: 500 });
  }
}
