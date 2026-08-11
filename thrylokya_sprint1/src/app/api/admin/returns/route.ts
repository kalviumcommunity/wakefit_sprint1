import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const returns = await prisma.returnRequest.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: {
          include: {
            orderItems: { include: { product: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(returns);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin returns' }, { status: 500 });
  }
}
