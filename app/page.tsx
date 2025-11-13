import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();
  
  if (session) {
    redirect('/dashboard');
  }

  // If no valid session, redirect to login
  redirect('/login');
}