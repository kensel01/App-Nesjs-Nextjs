import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function ButtonAuth() {
  const { isAuthenticated, handleLogout } = useAuth();

  const onLogout = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return isAuthenticated ? (
    <Button
      variant="destructive"
      onClick={onLogout}
      className="ml-4"
    >
      Cerrar Sesión
    </Button>
  ) : null;
} 