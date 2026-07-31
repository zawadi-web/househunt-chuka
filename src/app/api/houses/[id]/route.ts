import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'House ID or slug is required' }, { status: 400 });
    }

    const house = await prisma.house.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            verificationStatus: true,
            subscriptionTier: true,
            image: true,
            createdAt: true,
          },
        },
        images: true,
        town: true,
        campus: true,
        reviews: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!house) {
      return NextResponse.json({ success: false, error: 'House listing not found' }, { status: 404 });
    }

    // Increment view count asynchronously
    prisma.house.update({
      where: { id: house.id },
      data: { viewCount: { increment: 1 } },
    }).catch(err => console.error('Error incrementing house view count:', err));

    return NextResponse.json({ success: true, house });
  } catch (error: any) {
    console.error('[HOUSE BY ID GET API ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch house details' }, { status: 500 });
  }
}
