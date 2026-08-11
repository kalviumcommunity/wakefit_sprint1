import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.wishlistItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Wishlist item removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove wishlist item' }, { status: 500 });
  }
}
