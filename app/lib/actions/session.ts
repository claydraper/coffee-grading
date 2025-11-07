'use server';

import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, SessionData } from '../auth/session';
import { prisma } from '../prisma';

export async function createSession(user: { id: string; email: string; name: string }): Promise<string> {
  const sessionToken = randomBytes(32).toString('hex');
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // Session expires in 7 days
  
  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires,
    },
  });
  
  return sessionToken;
}

export async function getSession(sessionToken: string): Promise<SessionData | null> {
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session) {
    return null;
  }
  
  // Check if session is expired
  if (session.expires < new Date()) {
    await prisma.session.delete({ where: { sessionToken } });
    return null;
  }
  
  return {
    userId: session.userId,
    email: session.user.email,
    name: session.user.name,
    expires: session.expires,
  };
}

export async function deleteSession(sessionToken: string): Promise<void> {
  try {
    await prisma.session.delete({ where: { sessionToken } });
  } catch (error) {
    // Session might already be deleted, which is fine
    console.error('Error deleting session:', error);
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionToken) {
      return null;
    }
    
    const session = await getSession(sessionToken);
    return session;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  return user;
}
