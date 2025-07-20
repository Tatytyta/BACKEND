# Ejemplo para crear un préstamo

## URL
POST https://biblioteca-bfb8.onrender.com/prestamos

## Headers
- Content-Type: application/json
- Authorization: Bearer tu_token_jwt

## Body
```json
{
  "usuarioId": 1,
  "libroId": 1,
  "fechaDevolucionEstimada": "2025-08-20",
    "observaciones": "Préstamo para trabajo de investigación"
    }
```

## Notas importantes
- El `usuarioId` debe corresponder a un usuario existente en la base de datos
- El `libroId` debe corresponder a un libro disponible existente en la base de datos
- La `fechaDevolucionEstimada` es opcional, si no se especifica se calculará automáticamente según las políticas de la biblioteca
- El `estado` es opcional, por defecto será "activo"
- Las `observaciones` son opcionales y permiten añadir comentarios sobre el préstamo

## Permisos requeridos
- Para crear préstamos necesitas tener uno de estos roles: "admin", "administrador" o "bibliotecario"

## Posibles respuestas
- 201 Created: El préstamo se ha creado correctamente
- 400 Bad Request: Datos inválidos (IDs no numéricos, fechas mal formateadas, etc.)
- 403 Forbidden: No tienes permisos para crear préstamos
- 404 Not Found: El usuario o el libro no existen
- 409 Conflict: El libro no está disponible para préstamo

## Ejemplos de errores comunes
- Si el libro ya está prestado, recibirás un error de disponibilidad
- Si el usuario ha alcanzado su límite de préstamos, recibirás un error
- Si los IDs se envían como strings en lugar de números, recibirás un error de validación
