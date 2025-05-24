'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center text-center">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Algo salió mal!</h2>
        <p className="text-muted-foreground">
          {error.message || 'Ha ocurrido un error inesperado.'}
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={() => reset()}>Intentar de nuevo</Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
} 