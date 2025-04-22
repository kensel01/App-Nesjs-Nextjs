'use client';

import { getSession } from 'next-auth/react';

export async function getHeaders(): Promise<HeadersInit> {
  const session = await getSession();

  return {
    'Content-Type': 'application/json',
    Authorization: session?.user?.accessToken ? `Bearer ${session.user.accessToken}` : '',
  };
} 