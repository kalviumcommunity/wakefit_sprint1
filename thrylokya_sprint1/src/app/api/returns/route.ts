import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {
      userId: session.user.id,
    };

    if (status && status !== 'All') {
      const upper = status.toUpperCase();
      if (['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'].includes(upper)) {
        where.status = upper;
      }
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { orderId: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
      ];
    }

    const returns = await prisma.returnRequest.findMany({
      where,
      include: {
        order: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(returns);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, reason, pickupDate, timeSlot, refundMethod } = await req.json();

    if (!orderId || !reason || !pickupDate || !timeSlot || !refundMethod) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const retId = `RET-2024-${Math.floor(100 + Math.random() * 900)}`;

    const newReturn = await prisma.returnRequest.create({
      data: {
        id: retId,
        userId: session.user.id,
        orderId,
        status: 'PENDING',
        reason,
        pickupDate: new Date(pickupDate),
        timeSlot,
        refundMethod,
      },
      include: {
        order: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(newReturn, { status: 201 });
  } catch (error) {
    console.error('Schedule return error:', error);
    return NextResponse.json({ error: 'Failed to schedule return' }, { status: 500 });
  }
}
