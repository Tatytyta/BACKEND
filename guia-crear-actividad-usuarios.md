# Guía paso a paso para crear actividades de usuarios

## Introducción
El sistema permite registrar diferentes tipos de actividad de los usuarios, como búsquedas, préstamos, visualizaciones, etc. Hay dos formas de registrar actividades:
1. Registrar actividad para un usuario específico (requiere permisos de administrador)
2. Registrar actividad para tu propio usuario (mi-actividad)

⚠️ **ATENCIÓN**: Si obtienes un error 404 que menciona "/api/mongodb/sales-analytics", significa que estás usando una URL incorrecta. Asegúrate de usar exactamente las URLs que se muestran en esta guía.

## Paso 1: Obtener un token de acceso válido

```
POST https://biblioteca-bfb8.onrender.com/auth/login
Content-Type: application/json

{
  "email": "admin2@bibliotec.com",
  "password": "Admin123"
}
```

Guarda el token JWT que recibirás en la respuesta.

## Paso 2: Decide qué tipo de actividad registrar

Los tipos de actividad disponibles son:
- `busqueda`: Cuando el usuario busca algún contenido
- `prestamo`: Cuando se registra un préstamo
- `devolucion`: Cuando se devuelve un libro
- `resena`: Cuando se escribe una reseña
- `login`: Cuando el usuario inicia sesión
- `logout`: Cuando el usuario cierra sesión
- `registro`: Cuando un usuario se registra
- `visualizacion`: Cuando un usuario visualiza contenido

⚠️ **MUY IMPORTANTE**: Los valores del campo "tipo" deben ir en **minúsculas** (como se muestra arriba), no en mayúsculas. Usar "PRESTAMO" en lugar de "prestamo" generará un error de validación.

## Paso 3: Registrar actividad para tu propio usuario

```
POST https://biblioteca-bfb8.onrender.com/actividad-usuarios/mi-actividad
Authorization: Bearer tu_token_jwt_aquí
Content-Type: application/json

{
  "tipo": "visualizacion",
  "descripcion": "Usuario visualizó detalles del libro",
  "idLibro": 1,
  "metadata": {
    "tiempoVisualizacion": 120,
    "paginasVistas": 3
  }
}
```

⚠️ **IMPORTANTE**: Asegúrate de usar la URL correcta. El error 404 "Cannot POST /api/mongodb/sales-analytics" indica que estás usando una URL incorrecta.
```

## Paso 4: Registrar actividad para otro usuario (solo administradores)

```
POST https://biblioteca-bfb8.onrender.com/actividad-usuarios/1
Authorization: Bearer tu_token_jwt_aquí
Content-Type: application/json

{
  "tipo": "prestamo",
  "descripcion": "Préstamo de libro registrado manualmente por administrador",
  "idLibro": 2,
  "idPrestamo": 5,
  "metadata": {
    "razonManual": "Registro retroactivo"
  }
}
```

Nota: En este ejemplo, el "1" después de "/actividad-usuarios/" es el ID del usuario para el que estás registrando la actividad.

## Ejemplos por tipo de actividad:

### 1. Registro de búsqueda
```json
{
  "tipo": "busqueda",
  "descripcion": "Búsqueda de libros de ciencia ficción",
  "consulta": "ciencia ficcion",
  "metadata": {
    "resultados": 15,
    "filtros": ["genero=ciencia-ficcion"]
  }
}
```

### 2. Registro de préstamo
```json
{
  "tipo": "prestamo",
  "descripcion": "Préstamo del libro 'Cien años de soledad'",
  "idLibro": 3,
  "idPrestamo": 12
}
```

### 3. Registro de visualización
```json
{
  "tipo": "VISUALIZACION",
  "descripcion": "Visualización de detalles de libro",
  "idLibro": 5
}
```

### 4. Registro de reseña
```json
{
  "tipo": "RESENA",
  "descripcion": "Usuario dejó reseña en libro",
  "idLibro": 7,
  "idResena": 3
}
```

## Posibles problemas y soluciones:

1. **Error 401 Unauthorized**: Asegúrate de incluir el token JWT correctamente.
2. **Error 403 Forbidden**: Para registrar actividad de otros usuarios necesitas rol de administrador.
3. **Error 400 Bad Request**: Verifica el formato de tu JSON y que el tipo de actividad sea válido.
4. **Error 500 Internal Server Error**: Podría indicar un problema con la conexión a la base de datos MongoDB.
