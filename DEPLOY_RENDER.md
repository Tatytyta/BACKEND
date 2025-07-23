# 🚀 Despliegue en Render - Backend Biblioteca

## 📋 Preparación para el Despliegue

### 1. Repositorio
Asegúrate de que el código esté subido a GitHub: `https://github.com/Tatytyta/BACKEND`

### 2. Variables de Entorno Requeridas

Configura estas variables en el Dashboard de Render:

#### 🗄️ Base de Datos PostgreSQL
```
DB_HOST=tu-postgresql-host.render.com
DB_PORT=5432
DB_USER=tu-username
DB_PASS=tu-password
DB_NAME=biblioteca
```

#### 🍃 MongoDB (Recomendado: MongoDB Atlas)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/biblioteca
```

#### 🔐 JWT y Seguridad
```
JWT_SECRET=tu-secreto-super-seguro-jwt-produccion
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=tu-secreto-super-seguro-refresh-produccion
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
```

#### 🌐 CORS
```
CORS_ORIGIN=https://tu-frontend-url.onrender.com
```

### 3. Configuración en Render

1. **Crear Web Service**:
   - Conectar repositorio: `Tatytyta/BACKEND`
   - Rama: `main`
   - Root Directory: deja vacío
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

2. **Plan**: Free tier está bien para empezar

3. **Configurar Variables de Entorno**:
   - Ve a Environment Variables en tu servicio
   - Agrega todas las variables listadas arriba

### 4. Base de Datos

#### PostgreSQL en Render:
1. Crear PostgreSQL Database en Render
2. Copiar la URL de conexión
3. Extraer los valores para las variables DB_*

#### MongoDB Atlas (Recomendado):
1. Crear cluster gratuito en [MongoDB Atlas](https://cloud.mongodb.com)
2. Configurar usuario de base de datos
3. Whitelist IP: `0.0.0.0/0` (para Render)
4. Obtener connection string

### 5. Primer Despliegue

1. Hacer push de estos cambios a GitHub
2. En Render, el despliegue debería iniciar automáticamente
3. Verificar logs de construcción y despliegue
4. Probar endpoints en la URL de Render

### 6. Endpoints de Prueba

Una vez desplegado, probar:
```
GET https://tu-backend-url.onrender.com/auth/test
GET https://tu-backend-url.onrender.com/libros
```

### 7. Troubleshooting

- **Error de CORS**: Verifica que CORS_ORIGIN esté configurado correctamente
- **Error de DB**: Verifica las credenciales de PostgreSQL y MongoDB
- **Error 500**: Revisa los logs en el dashboard de Render
- **Cold Start**: El servicio gratuito puede tardar ~30s en despertar

### 8. Optimizaciones Post-Despliegue

- Configurar dominio personalizado
- Implementar monitoring y logging
- Configurar CI/CD con GitHub Actions
- Migrar a plan pagado para mejor rendimiento

## 🔧 Comandos de Desarrollo

```bash
# Desarrollo local
npm run start:dev

# Construcción
npm run build

# Producción local
npm run start:prod

# Tests
npm run test
```
