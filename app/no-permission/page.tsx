// app/no-permission/page.tsx

export default function NoPermissionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso denegado</h1>
      <p className="text-lg mb-6">No tienes permisos para acceder a esta página.</p>
      <a
        href="/"
        className="inline-block bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
      >
        Volver al inicio
      </a>
    </div>
  );
}