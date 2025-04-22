'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Plus, Search, Edit, Trash2, MoreHorizontal, UserCog, Shield, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { usersService } from '@/services/users.service';
import { User, Role } from '@/types/user.types';
import { PagePermissionGuard } from '@/components/auth/PagePermissionGuard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function UsersPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.getUsers();
      setUsers(response.users);
      applyFilters(response.users, searchQuery, activeFilter, roleFilter);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para aplicar todos los filtros
  const applyFilters = (
    userList: User[],
    search: string,
    active: string,
    role: string
  ) => {
    let filtered = [...userList];

    // Aplicar filtro de búsqueda
    if (search.trim() !== '') {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      );
    }

    // Aplicar filtro de estado activo
    if (active !== 'all') {
      const isActive = active === 'active';
      filtered = filtered.filter((user) => user.isActive === isActive);
    }

    // Aplicar filtro de rol
    if (role !== 'all') {
      filtered = filtered.filter((user) => user.role === role);
    }

    setFilteredUsers(filtered);
  };

  // Filtrar usuarios según todos los criterios
  useEffect(() => {
    applyFilters(users, searchQuery, activeFilter, roleFilter);
  }, [searchQuery, activeFilter, roleFilter, users]);

  // Manejar la eliminación de usuario
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      await usersService.delete(userToDelete.id);
      
      // Actualizar la lista de usuarios
      await fetchUsers();

      toast({
        title: 'Usuario eliminado',
        description: `El usuario ${userToDelete.name} ha sido eliminado correctamente`,
      });

      // Cerrar el diálogo
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el usuario',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  // Confirmar eliminación
  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Cambiar estado activo/inactivo
  const toggleUserStatus = async (user: User) => {
    try {
      await usersService.toggleUserStatus(user.id);
      
      toast({
        title: 'Estado actualizado',
        description: `El usuario ${user.name} ha sido ${user.isActive ? 'desactivado' : 'activado'} correctamente`,
      });
      
      // Actualizar la lista
      fetchUsers();
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado del usuario',
        variant: 'destructive',
      });
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Obtener el texto y el color del estado del rol
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return { label: 'Administrador', variant: 'destructive' as const };
      case Role.TECNICO:
        return { label: 'Técnico', variant: 'warning' as const };
      case Role.USER:
        return { label: 'Usuario', variant: 'secondary' as const };
      default:
        return { label: 'Desconocido', variant: 'outline' as const };
    }
  };

  // Obtener el texto y el color del estado de activación
  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? { label: 'Activo', variant: 'success' as const }
      : { label: 'Inactivo', variant: 'destructive' as const };
  };

  return (
    <PagePermissionGuard allowedRoles={[Role.ADMIN]}>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gestión de Usuarios</CardTitle>
            <Link href="/dashboard/users/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar usuarios..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={activeFilter}
                  onValueChange={setActiveFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={roleFilter}
                  onValueChange={setRoleFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value={Role.ADMIN}>Administrador</SelectItem>
                    <SelectItem value={Role.TECNICO}>Técnico</SelectItem>
                    <SelectItem value={Role.USER}>Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Creación</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No se encontraron usuarios con esos criterios
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => {
                        const roleBadge = getRoleBadge(user.role);
                        const statusBadge = getStatusBadge(user.isActive);
                        
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={roleBadge.variant}>
                                {roleBadge.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusBadge.variant}>
                                {statusBadge.label}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <Link href={`/dashboard/users/${user.id}`}>
                                    <DropdownMenuItem>
                                      <UserCog className="mr-2 h-4 w-4" />
                                      Ver detalles
                                    </DropdownMenuItem>
                                  </Link>
                                  <Link href={`/dashboard/users/edit/${user.id}`}>
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Editar
                                    </DropdownMenuItem>
                                  </Link>
                                  <DropdownMenuItem onClick={() => toggleUserStatus(user)}>
                                    <Power className="mr-2 h-4 w-4" />
                                    {user.isActive ? 'Desactivar' : 'Activar'}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => confirmDelete(user)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diálogo de confirmación para eliminar usuario */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Confirmar eliminación?</DialogTitle>
              <DialogDescription>
                Esta acción eliminará permanentemente al usuario{' '}
                <span className="font-semibold">{userToDelete?.name}</span>. Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PagePermissionGuard>
  );
}