import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Session } from 'next-auth';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const params = await Promise.resolve(context.params);
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be signed in to access this endpoint' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeSamples = searchParams.get('includeSamples') === 'true';

    if (!params?.id) {
      return NextResponse.json(
        { error: 'Cupping ID is required' },
        { status: 400 }
      );
    }

    const cupping = await prisma.cupping.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        samples: includeSamples,
      },
    });

    if (!cupping) {
      return NextResponse.json(
        { error: 'Cupping not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(cupping);
  } catch (error) {
    console.error('Error fetching cupping:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cupping' },
      { status: 500 }
    );
  }
}
