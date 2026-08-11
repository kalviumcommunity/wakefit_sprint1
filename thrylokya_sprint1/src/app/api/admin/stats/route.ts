import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const [totalUsers, totalOrders, totalReturns, productsCount, orders] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.returnRequest.count(),
      prisma.product.count(),
      prisma.order.findMany({ select: { totalPrice: true } }),
    ]);

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const returnsByStatus = await prisma.returnRequest.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const formattedReturnsByStatus: Record<string, number> = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      COMPLETED: 0,
    };

    returnsByStatus.forEach((item) => {
      formattedReturnsByStatus[item.status] = item._count.status;
    });

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalReturns,
      productsCount,
      totalRevenue,
      returnsByStatus: formattedReturnsByStatus,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
