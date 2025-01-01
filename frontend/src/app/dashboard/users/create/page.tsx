'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateUserForm from '../../../../../components/users/CreateUserForm';
import { authService } from '../../../../../src/services/auth.service';

export default function CreateUserPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Usuario</h1>
      <CreateUserForm />
    </div>
  );
} 