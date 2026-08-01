import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userSession = session?.user as any;

    if (!userSession?.id && !userSession?.email) {
      return NextResponse.json({ success: true, unreadCount: 0 });
    }

    let currentUserId = userSession.id;
    if (!currentUserId && userSession.email) {
      const dbUser = await prisma.user.findUnique({ where: { email: userSession.email } });
      if (dbUser) currentUserId = dbUser.id;
    }

    if (!currentUserId) {
      return NextResponse.json({ success: true, unreadCount: 0 });
    }

    // Find all chat rooms for current user
    const rooms = await prisma.chatRoom.findMany({
      where: {
        OR: [
          { studentId: currentUserId },
          { landlordId: currentUserId },
        ],
      },
      select: { id: true },
    });

    const roomIds = rooms.map(r => r.id);

    if (roomIds.length === 0) {
      return NextResponse.json({ success: true, unreadCount: 0 });
    }

    // Count unread messages sent by someone else
    const unreadCount = await prisma.message.count({
      where: {
        chatRoomId: { in: roomIds },
        senderId: { not: currentUserId },
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json({ success: true, unreadCount: 0 });
  }
}
