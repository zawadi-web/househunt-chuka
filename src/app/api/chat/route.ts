import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userSession = session?.user as any;

    if (!userSession?.id && !userSession?.email) {
      return NextResponse.json({ success: false, message: 'Authentication required to access chat.' }, { status: 401 });
    }

    // Get DB User ID
    let currentUserId = userSession.id;
    if (!currentUserId && userSession.email) {
      const dbUser = await prisma.user.findUnique({ where: { email: userSession.email } });
      if (dbUser) currentUserId = dbUser.id;
    }

    if (!currentUserId) {
      return NextResponse.json({ success: false, message: 'User account not found.' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const landlordId = searchParams.get('landlordId') || searchParams.get('landlord');
    const roomId = searchParams.get('roomId');

    // If landlordId is provided, find or create chat room between student and landlord
    if (landlordId && landlordId !== currentUserId) {
      let existingRoom = await prisma.chatRoom.findFirst({
        where: {
          OR: [
            { studentId: currentUserId, landlordId: landlordId },
            { studentId: landlordId, landlordId: currentUserId },
          ],
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              sender: {
                select: { id: true, name: true, image: true, role: true },
              },
            },
          },
        },
      });

      if (!existingRoom) {
        // Find landlord user info to verify existence
        const targetLandlord = await prisma.user.findUnique({ where: { id: landlordId } });
        if (targetLandlord) {
          existingRoom = await prisma.chatRoom.create({
            data: {
              studentId: currentUserId,
              landlordId: targetLandlord.id,
            },
            include: {
              messages: {
                orderBy: { createdAt: 'asc' },
                include: {
                  sender: {
                    select: { id: true, name: true, image: true, role: true },
                  },
                },
              },
            },
          });
        }
      }
    }

    // Fetch all chat rooms involving current user
    const rooms = await prisma.chatRoom.findMany({
      where: {
        OR: [
          { studentId: currentUserId },
          { landlordId: currentUserId },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Collect IDs of all other participants
    const otherUserIds = new Set<string>();
    rooms.forEach(r => {
      if (r.studentId !== currentUserId) otherUserIds.add(r.studentId);
      if (r.landlordId !== currentUserId) otherUserIds.add(r.landlordId);
    });

    // If target landlord was passed but had no room yet, add target landlord to user IDs
    if (landlordId && landlordId !== currentUserId) {
      otherUserIds.add(landlordId);
    }

    const otherUsers = await prisma.user.findMany({
      where: { id: { in: Array.from(otherUserIds) } },
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

    const userMap = new Map(otherUsers.map(u => [u.id, u]));

    // Format rooms with contact participant info
    const formattedRooms = rooms.map(room => {
      const otherId = room.studentId === currentUserId ? room.landlordId : room.studentId;
      const contact = userMap.get(otherId) || {
        id: otherId,
        name: 'Landlord User',
        email: '',
        phone: '',
        image: null,
        role: 'LANDLORD',
        verificationStatus: 'VERIFIED',
      };

      return {
        id: room.id,
        contact,
        messages: room.messages.map(m => ({
          id: m.id,
          senderId: m.senderId,
          senderName: m.sender?.name || 'User',
          content: m.content,
          isRead: m.isRead,
          createdAt: m.createdAt,
        })),
        updatedAt: room.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      currentUserId,
      rooms: formattedRooms,
    });

  } catch (error: any) {
    console.error('[CHAT GET API ERROR]', error);
    return NextResponse.json({ success: false, message: 'Failed to load chats.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userSession = session?.user as any;

    if (!userSession?.id && !userSession?.email) {
      return NextResponse.json({ success: false, message: 'Authentication required to send messages.' }, { status: 401 });
    }

    let currentUserId = userSession.id;
    if (!currentUserId && userSession.email) {
      const dbUser = await prisma.user.findUnique({ where: { email: userSession.email } });
      if (dbUser) currentUserId = dbUser.id;
    }

    if (!currentUserId) {
      return NextResponse.json({ success: false, message: 'Sender user account not found.' }, { status: 404 });
    }

    const body = await req.json();
    const { chatRoomId, landlordId, recipientId, content } = body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ success: false, message: 'Message content cannot be empty.' }, { status: 400 });
    }

    let targetRoomId = chatRoomId;

    // If chatRoomId is not provided, find or create room with recipient/landlord
    if (!targetRoomId) {
      const targetUserId = landlordId || recipientId;
      if (!targetUserId) {
        return NextResponse.json({ success: false, message: 'Recipient or Chat Room ID is required.' }, { status: 400 });
      }

      let room = await prisma.chatRoom.findFirst({
        where: {
          OR: [
            { studentId: currentUserId, landlordId: targetUserId },
            { studentId: targetUserId, landlordId: currentUserId },
          ],
        },
      });

      if (!room) {
        room = await prisma.chatRoom.create({
          data: {
            studentId: currentUserId,
            landlordId: targetUserId,
          },
        });
      }
      targetRoomId = room.id;
    }

    // Create Message in DB
    const newMessage = await prisma.message.create({
      data: {
        chatRoomId: targetRoomId,
        senderId: currentUserId,
        content: content.trim(),
      },
    });

    // Update ChatRoom updatedAt timestamp
    await prisma.chatRoom.update({
      where: { id: targetRoomId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: newMessage,
    });

  } catch (error: any) {
    console.error('[CHAT POST API ERROR]', error);
    return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 });
  }
}
