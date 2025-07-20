# Guía de autenticación para Postman

Esta guía detalla cómo autenticarte correctamente en la API usando Postman.

## 1. Obtener un token (Login)

**URL**: `https://biblioteca-bfb8.onrender.com/auth/login`
**Método**: POST
**Body** (raw JSON):
```json
{
  "email": "admin@biblioteca.com",
  "password": "Admin123"
}
```

## 2. Configurar el token para solicitudes autenticadas

Después de obtener la respuesta del login, debes:

1. Copiar el valor del campo `access_token` (sin las comillas)
2. Para cada solicitud protegida:
   - Ve a la pestaña "Authorization"
   - Selecciona "Bearer Token" del menú desplegable
   - Pega el token en el campo "Token"

## 3. Endpoints de prueba

- **Público**: `https://biblioteca-bfb8.onrender.com/test-auth`
  - Este endpoint no requiere autenticación

- **Protegido**: `https://biblioteca-bfb8.onrender.com/test-auth/protegido`
  - Este endpoint requiere autenticación con token JWT

## 4. Resolución de problemas

Si recibes un error 401 Unauthorized:

1. Verifica que el token no haya expirado (validez: 1 hora)
2. Comprueba que estás usando "Bearer Token" y no otro tipo de autenticación
3. Asegúrate de incluir el prefijo "Bearer " antes del token (Postman lo hace automáticamente)
4. Confirma que has copiado el token completo sin espacios adicionales
5. Inicia sesión nuevamente para obtener un nuevo token

## 5. Verificación del token

Si quieres verificar si tu token es válido, puedes probarlo en:
`https://biblioteca-bfb8.onrender.com/test-auth/protegido`

Si el token es válido, recibirás una respuesta exitosa con tus datos de usuario.
