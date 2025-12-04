// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/auth';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      {
        user,
        message: 'Registration successful'
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);

    let errorMessage = 'An error occurred during registration';
    let errorDetails: unknown = undefined;

    if (error instanceof Error) {
      errorMessage = error.message;
      if (process.env.NODE_ENV === 'development') {
        errorDetails = {
          message: error.message,
          stack: error.stack,
          name: error.name
        };
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { details: errorDetails })
      },
      { status: 500 }
    );
  }
}