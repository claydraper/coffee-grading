import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Cupping ID is required' },
        { status: 400 }
      );
    }

    const cupping = await prisma.cupping.findUnique({
      where: { id },
      include: {
        samples: {
          orderBy: {
            sampleId: 'asc'
          }
        },
      },
    });

    if (!cupping) {
      return NextResponse.json(
        { error: 'Cupping session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(cupping);
  } catch (error) {
    console.error('Error fetching cupping results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cupping results' },
      { status: 500 }
    );
  }
}
