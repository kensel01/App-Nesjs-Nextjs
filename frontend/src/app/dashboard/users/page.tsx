'use client';

import { UsersTable } from '@/components/users/UsersTable';
import { PagePermissionGuard } from '@/components/auth/PagePermissionGuard';

export default function UsersPage() {
  return (
    <PagePermissionGuard resource="users" action="read">
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
        <UsersTable />
      </div>
    </PagePermissionGuard>
  );
} 