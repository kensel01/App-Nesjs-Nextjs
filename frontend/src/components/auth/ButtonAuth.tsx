import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function ButtonAuth() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return isAuthenticated ? (
    <Button
      variant="destructive"
      onClick={handleLogout}
      className="ml-4"
    >
      Cerrar Sesión
    </Button>
  ) : null;
} 