import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { validateHouseListing } from '@/lib/validations';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateSimpleImageHash } from '@/lib/upload-validator';

export async function GET(request: Request) {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const limiter = rateLimit(`get_houses_${clientIp}`, { limit: 60, windowMs: 60 * 1000 });

  if (!limiter.success) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again in 60 seconds.' },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area');
    const maxPrice = searchParams.get('maxPrice');
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const statusParam = searchParams.get('status') || 'APPROVED';
    const landlordIdParam = searchParams.get('landlordId');

    const whereClause: any = {};

    if (statusParam !== 'ALL') {
      whereClause.status = statusParam;
    }

    if (landlordIdParam) {
      whereClause.landlordId = landlordIdParam;
    }

    if (area && area !== 'ALL') {
      whereClause.areaName = { contains: area, mode: 'insensitive' };
    }

    if (maxPrice) {
      whereClause.rentPerMonth = { lte: Number(maxPrice) };
    }

    if (verifiedOnly) {
      whereClause.landlord = { verificationStatus: 'VERIFIED' };
    }

    const dbHouses = await prisma.house.findMany({
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
            image: true,
          },
        },
        images: true,
        town: true,
        campus: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      count: dbHouses.length,
      data: dbHouses
    });
  } catch (error: any) {
    console.error('[HOUSES GET API ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch houses', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const limiter = rateLimit(`post_house_${clientIp}`, { limit: 10, windowMs: 60 * 1000 });

  if (!limiter.success) {
    return NextResponse.json(
      { success: false, message: 'Rate limit exceeded. Please wait 1 minute before posting again.' },
      { status: 429 }
    );
  }

  try {
    const session = await auth();
    const sessionUser = session?.user as any;
    const body = await request.json();

    const landlordId = sessionUser?.id || body.landlordId;

    if (!landlordId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required to post house listings. Please sign in.' },
        { status: 401 }
      );
    }

    // Verify landlord user exists in DB
    let landlord = await prisma.user.findUnique({ where: { id: landlordId } });
    if (!landlord && sessionUser?.email) {
      landlord = await prisma.user.findUnique({ where: { email: sessionUser.email } });
    }

    if (!landlord) {
      return NextResponse.json(
        { success: false, message: 'Landlord account not found. Please log in again.' },
        { status: 404 }
      );
    }

    // Input Validation
    const validation = validateHouseListing(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Ensure Town & Campus exist
    let town = await prisma.town.findFirst({ where: { name: 'Chuka' } });
    if (!town) {
      town = await prisma.town.create({
        data: {
          name: 'Chuka',
          slug: 'chuka',
          county: 'Tharaka Nithi',
        },
      });
    }

    let campus = await prisma.campus.findFirst({ where: { townId: town.id } });
    if (!campus) {
      campus = await prisma.campus.create({
        data: {
          name: 'Chuka University Main Campus',
          slug: 'chuka-main-campus',
          townId: town.id,
          latitude: -0.3324,
          longitude: 37.6496,
        },
      });
    }

    // Parse images array
    const photos: string[] = Array.isArray(body.photos) && body.photos.length > 0
      ? body.photos
      : (body.imageUrl ? [body.imageUrl] : []);

    const slug = `${body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-6)}`;

    // Create House in PostgreSQL database
    const newHouse = await prisma.house.create({
      data: {
        title: body.title,
        slug,
        description: body.description || body.title,
        rentPerMonth: Number(body.rentPerMonth),
        depositRequired: Number(body.depositRequired || body.rentPerMonth),
        availableRooms: Number(body.availableRooms || 1),
        totalRooms: Number(body.totalRooms || 1),
        roomType: body.roomType || 'Bedsitter',
        paymentPeriod: body.paymentPeriod || 'MONTHLY',
        pricePerSemester: body.pricePerSemester ? Number(body.pricePerSemester) : null,
        waterAvailability: body.waterAvailability || (body.wifiAvailable ? '24/7 Borehole Water' : 'City Water'),
        electricityType: body.electricityType || 'Prepaid Tokens',
        wifiAvailable: Boolean(body.wifiAvailable),
        securityGuarded: Boolean(body.securityGuarded),
        cctv: Boolean(body.cctv),
        gatedFence: Boolean(body.gatedFence),
        furnished: Boolean(body.furnished),
        parking: Boolean(body.parking),
        balcony: Boolean(body.balcony),
        garbageCollection: Boolean(body.garbageCollection ?? true),
        address: body.address || body.areaName,
        areaName: body.areaName,
        latitude: body.latitude ? Number(body.latitude) : -0.3324,
        longitude: body.longitude ? Number(body.longitude) : 37.6496,
        distanceFromCampus: Number(body.distanceFromCampus || 0.5),
        campusId: campus.id,
        townId: town.id,
        landlordId: landlord.id,
        status: 'PENDING_APPROVAL', // Mandatory moderation
        images: {
          create: photos.map((photoUrl, idx) => ({
            url: photoUrl,
            publicId: `img_${Date.now()}_${idx}`,
            imageHash: calculateSimpleImageHash(photoUrl),
            isPrimary: idx === 0,
          })),
        },
      },
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            verificationStatus: true,
          },
        },
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'House listing submitted successfully! Sent to Admin moderation queue.',
      data: newHouse,
    });
  } catch (error: any) {
    console.error('[HOUSES POST API ERROR]', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to submit house listing.' },
      { status: 500 }
    );
  }
}

