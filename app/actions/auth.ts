'server';

import { getCurrentUser as getCurrentUserFromSession } from '@/app/lib/auth/session';

export async function getCurrentUser() {
  return await getCurrentUserFromSession();
}
