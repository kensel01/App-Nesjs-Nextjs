'use client';

import { getSession } from 'next-auth/react';

export async function getHeaders(): Promise<HeadersInit> {
  const session = await getSession();

  return {
    'Content-Type': 'application/json',
    Authorization: session?.user?.accessToken ? `Bearer ${session.user.accessToken}` : '',
  };
}

export function getAuthHeaders() {
  const { data: session } = useSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.token}`,
  };
} 