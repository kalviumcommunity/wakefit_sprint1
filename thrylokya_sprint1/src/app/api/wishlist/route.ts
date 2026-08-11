import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(wishlistItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId } = await req.json();

    const existing = await prisma.wishlistItem.findFirst({
      where: { userId: session.user.id, productId },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ message: 'Removed from wishlist', action: 'REMOVED' });
    }

    const newItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: { product: true },
    });

    return NextResponse.json({ ...newItem, action: 'ADDED' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle wishlist' }, { status: 500 });
  }
}
