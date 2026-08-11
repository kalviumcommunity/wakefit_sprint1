import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, quantity = 1 } = await req.json();

    const existing = await prisma.cartItem.findFirst({
      where: { userId: session.user.id, productId },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
      return NextResponse.json(updated);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
      },
      include: { product: true },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}
