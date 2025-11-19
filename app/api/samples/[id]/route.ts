import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/app/lib/prisma';

// Type assertion to fix the Prisma client type
const prismaClient = prisma as unknown as PrismaClient & {
  sample: any; // Use 'any' as a last resort
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

    // Ensure the sample belongs to the current user
    const sample = await prismaClient.sample.findUnique({
      where: { id },
      include: { cupping: true }
    });

    if (!sample || sample.cupping.userId !== session.user.id) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Update the sample
    const updatedSample = await prismaClient.sample.update({
      where: { id },
      data: {
        ...data,
        // Ensure numeric fields are properly typed
        elevation: data.elevation ? parseInt(data.elevation) : null,
        roastDate: data.roastDate ? new Date(data.roastDate) : null,
      },
    });

    return NextResponse.json(updatedSample);
  } catch (error) {
    console.error('Error updating sample:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
