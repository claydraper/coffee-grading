import { NextResponse } from 'next/server';
import { deleteSession } from '@/app/lib/actions/session';

export async function POST() {
  try {
    // Clear the session cookie
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
    
    response.cookies.delete('session_token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Error during logout' },
      { status: 500 }
    );
  }
}
