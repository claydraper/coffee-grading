import { NextResponse } from 'next/server';
import { signOut } from '@/auth';

export async function POST() {
  try {
    // Sign out using NextAuth
    await signOut({ redirect: false });
    
    // Create a response with a success message
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
    
    // Clear the session cookie
    response.cookies.delete('__Secure-next-auth.session-token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Error during logout' },
      { status: 500 }
    );
  }
}
