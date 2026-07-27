import { NextResponse } from 'next/server';
import { MOCK_HOUSES } from '@/lib/mock-data';
import { rateLimit } from '@/lib/rate-limit';
import { validateHouseListing } from '@/lib/validations';
import { authorizeRole } from '@/lib/rbac';
import { calculateSimpleImageHash } from '@/lib/upload-validator';

export async function GET(request: Request) {
  // 1. Rate Limiting Check (30 requests per minute per IP)
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const limiter = rateLimit(`get_houses_${clientIp}`, { limit: 30, windowMs: 60 * 1000 });
  
  if (!limiter.success) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again in 60 seconds.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area');
  const maxPrice = searchParams.get('maxPrice');
  const verifiedOnly = searchParams.get('verifiedOnly') === 'true';

  let houses = MOCK_HOUSES;

  if (area && area !== 'ALL') {
    houses = houses.filter(h => h.areaName.toLowerCase().includes(area.toLowerCase()));
  }

  if (maxPrice) {
    houses = houses.filter(h => h.rentPerMonth <= Number(maxPrice));
  }

  if (verifiedOnly) {
    houses = houses.filter(h => h.landlord.verificationStatus === 'VERIFIED');
  }

  return NextResponse.json({
    success: true,
    count: houses.length,
    remainingRateLimit: limiter.remaining,
    data: houses
  });
}

export async function POST(request: Request) {
  // 1. Rate Limiting Check for POST requests (5 listings per minute)
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const limiter = rateLimit(`post_house_${clientIp}`, { limit: 5, windowMs: 60 * 1000 });

  if (!limiter.success) {
    return NextResponse.json(
      { success: false, message: 'Rate limit exceeded. Please wait 1 minute before posting again.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // 2. Role-Based Access Control (Only LANDLORD or AGENT can post listings)
    const mockUser = { id: body.landlordId || "l1", role: (body.userRole || 'LANDLORD') as any };
    const authCheck = authorizeRole(mockUser, ['LANDLORD', 'AGENT', 'ADMIN']);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.reason },
        { status: 403 }
      );
    }

    // 3. Strict Input Validation
    const validation = validateHouseListing(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // 4. Duplicate Image Detection Hash
    const primaryImageHash = body.imageUrl ? calculateSimpleImageHash(body.imageUrl) : null;

    const newListing = {
      id: `h_${Date.now()}`,
      title: body.title,
      rentPerMonth: body.rentPerMonth,
      depositRequired: body.depositRequired,
      areaName: body.areaName,
      roomType: body.roomType,
      distanceFromCampus: body.distanceFromCampus,
      imageHash: primaryImageHash,
      status: 'PENDING_APPROVAL', // Mandatory admin approval gate
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'House listing submitted successfully! Sent to Admin moderation queue.',
      data: newListing
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload structure' },
      { status: 400 }
    );
  }
}
