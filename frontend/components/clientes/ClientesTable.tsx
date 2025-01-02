'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Cliente } from '@/types/cliente.types';
import { clientesService } from '@/services/clientes.service';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function ClientesTable() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        if (session) {
          const data = await clientesService.getAll();
          setClientes(data);
          setError(null);
        }
      } catch (err) {
        setError('Error al cargar los clientes');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [session]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
      return;
    }

    try {
      await clientesService.delete(id);
      setClientes(clientes.filter(cliente => cliente.id !== id));
    } catch (err) {
      console.error('Error al eliminar el cliente:', err);
      alert('Error al eliminar el cliente');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RUT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teléfono
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dirección
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comuna
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ciudad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo de Servicio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td className="px-6 py-4 whitespace-nowrap">{cliente.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cliente.rut}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cliente.telefono}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cliente.email || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cliente.direccion}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cliente.comuna}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cliente.ciudad}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {cliente.tipoDeServicio.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Link
                  href={`/dashboard/clientes/edit/${cliente.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FaEdit className="inline-block w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(cliente.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash className="inline-block w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 