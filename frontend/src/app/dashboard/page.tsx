"use client";

import { PagePermissionGuard } from '@/components/auth/PagePermissionGuard';

export default function DashboardPage() {
  return (
    <PagePermissionGuard resource="users" action="read">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Bienvenido al panel de administración</p>
      </div>
    </PagePermissionGuard>
  );
}   
