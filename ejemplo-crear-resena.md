# Ejemplo correcto para crear una reseña

## URL
POST https://biblioteca-bfb8.onrender.com/resenas-libros

## Headers
- Content-Type: application/json
- Authorization: Bearer tu_token_jwt

## Body
```json
{
  "idLibro": 1,
  "calificacion": 4,
  "comentario": "Me pareció un libro excelente, muy recomendable."
}
```

## Notas
- El campo `idLibro` debe ser un número que corresponda a un libro existente en la base de datos
- La `calificacion` debe ser un número del 1 al 5
- El `comentario` es opcional pero recomendable
- No es necesario especificar el `idUsuario` si estás autenticado, ya que se tomará del token JWT

## Posibles errores
- Si intentas utilizar un ID de libro que no existe, recibirás un error
- Si envías la calificación como string ("4") en lugar de número (4), recibirás un error de validación
- Si no estás autenticado o tu token expiró, recibirás un error 401
