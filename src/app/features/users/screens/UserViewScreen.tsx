export const UserViewScreen = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600">Hola desde User View (Directorio)</h1>
      <p className="mt-2 text-gray-600">
        Si ves esto, tienes permiso de <strong>ver_usuarios</strong> o <strong>gestionar_usuarios</strong>.
        Aquí irá la tabla de solo lectura (sin acciones de edición).
      </p>
    </div>
  )
}