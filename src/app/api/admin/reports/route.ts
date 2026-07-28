import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let whereClause: any = {};
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      include: {
        reporter: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
        reportedUser: {
          select: { id: true, name: true, email: true, phone: true, role: true, verificationStatus: true },
        },
        house: {
          select: { id: true, title: true, areaName: true, rentPerMonth: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: reports.length, reports });
  } catch (error: any) {
    console.error('[ADMIN REPORTS GET ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch scam reports' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportId, status } = body;

    if (!reportId || !status) {
      return NextResponse.json({ success: false, error: 'Report ID and status are required' }, { status: 400 });
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });

    return NextResponse.json({ success: true, report: updatedReport });
  } catch (error: any) {
    console.error('[ADMIN REPORTS PATCH ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to update report status' }, { status: 500 });
  }
}
