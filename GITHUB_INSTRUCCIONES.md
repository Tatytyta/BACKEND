# Instrucciones para conectar con GitHub

Una vez que hayas creado el repositorio en GitHub, ejecuta estos comandos en la terminal:

```powershell
# Reemplaza "TU_USUARIO" con tu nombre de usuario de GitHub
# Reemplaza "biblioteca-backend" con el nombre que elegiste para tu repositorio

cd "c:\Users\ASUS Vivobook\Desktop\Projecty\backend"
git remote add origin https://github.com/TU_USUARIO/biblioteca-backend.git
git branch -M main
git push -u origin main
```

GitHub te solicitará tus credenciales. Si usas autenticación de dos factores, tendrás que usar un token de acceso personal en lugar de tu contraseña.

Para crear un token de acceso personal:
1. Ve a Settings (Configuración) > Developer settings (Configuración de desarrollador) > Personal access tokens (Tokens de acceso personal)
2. Selecciona "Generate new token" (Generar nuevo token)
3. Dale un nombre descriptivo, selecciona el ámbito "repo" y haz clic en "Generate token" (Generar token)
4. Copia el token generado y úsalo como contraseña cuando Git lo solicite
