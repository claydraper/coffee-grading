import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/app/lib/prisma';

// Type assertion to fix the Prisma client type
const prismaClient = prisma as unknown as PrismaClient & {
  cupping: any; // Use 'any' as a last resort
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user from the database
    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { name, description, numberOfSamples } = await request.json();

    // Create the cupping with its samples
    const cupping = await prismaClient.cupping.create({
      data: {
        name,
        description: description || null,
        userId: user.id,
        samples: {
          create: Array.from({ length: numberOfSamples }, (_, i) => ({
            sampleId: `S${i + 1}`,
            origin: '',
            process: '',
            userId: user.id,
            // Set default values for required fields
            fragranceAroma: 6.0,
            dry: 6.0,
            break: 6.0,
            flavor: 6.0,
            aftertaste: 6.0,
            acidity: 6.0,
            body: 6.0,
            balance: 6.0,
            overall: 6.0,
            taint: 0,
            fault: 0,
          }))
        }
      },
      include: {
        samples: true
      }
    });

    const samples = cupping.samples;

    // Return just the ID to reduce payload size
    return NextResponse.json(
      { id: cupping.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating cupping:', error);
    return NextResponse.json(
      { error: 'Failed to create cupping' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user from the database
    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cuppings = await prismaClient.cupping.findMany({
      where: { userId: user.id },
      include: {
        samples: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ cuppings });
  } catch (error) {
    console.error('Error fetching cuppings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cuppings' },
      { status: 500 }
    );
  }
}
