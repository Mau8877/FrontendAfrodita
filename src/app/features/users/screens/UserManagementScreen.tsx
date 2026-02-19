export const UserManagementScreen = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600">Hola desde User Management (Admin CRUD)</h1>
      <p className="mt-2 text-gray-600">
        Si ves esto, tienes permiso de <strong>gestionar_usuarios</strong>.
        Aquí irá la tabla con botones de Editar, Eliminar y Restaurar.
      </p>
    </div>
  )
}