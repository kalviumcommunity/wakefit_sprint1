import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { quantity } = await req.json();

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: params.id } });
      return NextResponse.json({ message: 'Item removed' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.cartItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Cart item removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 });
  }
}
