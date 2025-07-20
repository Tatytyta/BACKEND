# Módulo de Géneros

## Descripción
El módulo de géneros gestiona los diferentes tipos de géneros literarios disponibles en la biblioteca.

## Endpoints

### POST /generos
- **Descripción**: Crear un nuevo género
- **Autenticación**: JWT requerido
- **Roles**: admin, bibliotecario
- **Body**:
  ```json
  {
    "nombre": "string",
    "descripcion": "string (opcional)"
  }
  ```

### GET /generos
- **Descripción**: Obtener todos los géneros
- **Autenticación**: JWT requerido
- **Respuesta**: Lista de géneros con sus libros asociados

### GET /generos/:id
- **Descripción**: Obtener un género específico por ID
- **Autenticación**: JWT requerido
- **Parámetros**: id (number)

### GET /generos/buscar/nombre
- **Descripción**: Buscar género por nombre
- **Autenticación**: JWT requerido
- **Query**: nombre (string)

### GET /generos/:id/stats
- **Descripción**: Obtener estadísticas de un género
- **Autenticación**: JWT requerido
- **Parámetros**: id (number)
- **Respuesta**:
  ```json
  {
    "genero": "objeto género",
    "totalLibros": "number",
    "librosDisponibles": "number"
  }
  ```

### PUT /generos/:id
- **Descripción**: Actualizar un género
- **Autenticación**: JWT requerido
- **Roles**: admin, bibliotecario
- **Parámetros**: id (number)
- **Body**:
  ```json
  {
    "nombre": "string (opcional)",
    "descripcion": "string (opcional)"
  }
  ```

### DELETE /generos/:id
- **Descripción**: Eliminar un género
- **Autenticación**: JWT requerido
- **Roles**: admin
- **Parámetros**: id (number)
- **Restricciones**: No se puede eliminar si tiene libros asociados

## Estructura de Datos

### Entidad Genero
```typescript
{
  id: number;
  nombre: string;
  descripcion?: string;
  libros: Libro[];
}
```

### DTOs
- **CreateGeneroDto**: Para crear nuevos géneros
- **UpdateGeneroDto**: Para actualizar géneros existentes

## Validaciones
- Nombre único por género
- No se puede eliminar géneros con libros asociados
- Validaciones de entrada con class-validator

## Relaciones
- **OneToMany con Libro**: Un género puede tener muchos libros
