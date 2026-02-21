export const parseBackendErrors = (
  errors: Record<string, unknown> | null | undefined
): string[] => {
  if (!errors) return [];
  
  // Cambiado a const: el arreglo muta (push), pero la variable no se reasigna.
  const errorList: string[] = [];

  Object.entries(errors).forEach(([key, value]) => {
    // Si es un array (ej. "email": ["Ya existe..."])
    if (Array.isArray(value)) {
      value.forEach((msg) => errorList.push(`${key.toUpperCase()}: ${String(msg)}`));
    } 
    // Si es un objeto anidado (ej. "perfil": { "fecha_nacimiento": [...] })
    else if (typeof value === "object" && value !== null) {
      // Le decimos a TypeScript que confíe en que este objeto es otro Record
      const nestedErrors = parseBackendErrors(value as Record<string, unknown>);
      errorList.push(...nestedErrors);
    } 
    // Si es un string simple
    else if (typeof value === "string") {
      errorList.push(`${key.toUpperCase()}: ${value}`);
    }
  });

  return errorList;
};