export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Bienvenido</h2>
          <p className="mt-2 text-gray-600">
            Selecciona una opción del menú lateral para comenzar.
          </p>
        </div>
      </div>
    </div>
  );
}   
