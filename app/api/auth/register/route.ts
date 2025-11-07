import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { hashPassword } from '@/app/lib/auth/password';
import { createSession } from '@/app/lib/actions/session';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const { hash, salt } = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: hash,
        salt,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Create a session for the new user
    const sessionToken = await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      { message: 'Registration successful', user },
      { status: 201 }
    );

    // Set the session cookie with the resolved session token
    response.cookies.set({
      name: 'session_token',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
