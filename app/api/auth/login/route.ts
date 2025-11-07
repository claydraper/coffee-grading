import { NextResponse } from 'next/server';
import { verifyPassword } from '@/app/lib/auth/password';
import { createSession } from '@/app/lib/actions/session';
import prisma from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.hashedPassword || !user.salt) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(
      password,
      user.hashedPassword,
      user.salt
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create a new session
    const sessionToken = await createSession({
      id: user.id,
      email: user.email,
      name: user.name || 'User',
    });

    // Create a new response with the success message
    const response = NextResponse.json(
      { message: 'Login successful', user: { id: user.id, email: user.email, name: user.name } },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Set the session cookie
    response.cookies.set({
      name: 'session_token',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
