import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/app/lib/prisma';

const prismaClient = prisma as unknown as PrismaClient & {
  sample: any;
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const sample = await prismaClient.sample.findUnique({
      where: { id },
      include: { cupping: true }
    });

    if (!sample || sample.cupping.userId !== session.user.id) {
      return new NextResponse('Not found', { status: 404 });
    }

    const updatedSample = await prismaClient.sample.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return NextResponse.json(updatedSample);
  } catch (error) {
    console.error('Error updating sample:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
