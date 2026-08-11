import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { category, subject, message } = await req.json();

    if (!category || !subject || !message) {
      return NextResponse.json({ error: 'Category, subject, and message are required' }, { status: 400 });
    }

    const ticketId = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      message: 'Support ticket submitted successfully',
      ticketId,
      estimatedResponse: 'Under 24 hours',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit ticket' }, { status: 500 });
  }
}
