import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ret = await prisma.returnRequest.findUnique({
      where: { id: params.id },
      include: {
        order: {
          include: {
            orderItems: { include: { product: true } },
          },
        },
      },
    });

    if (!ret) return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
    if (ret.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(ret);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch return' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { status, action } = await req.json();

    if (action === 'CANCEL') {
      const ret = await prisma.returnRequest.findUnique({ where: { id: params.id } });
      if (!ret) return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
      if (ret.userId !== session.user.id && session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      await prisma.returnRequest.delete({ where: { id: params.id } });
      return NextResponse.json({ message: 'Return cancelled successfully' });
    }

    if (session.user.role === 'ADMIN' && status) {
      const updated = await prisma.returnRequest.update({
        where: { id: params.id },
        data: { status },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update return' }, { status: 500 });
  }
}
