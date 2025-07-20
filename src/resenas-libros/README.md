# Módulo de Reseñas de Libros

## Descripción

El módulo de reseñas de libros es un sistema completo para gestionar reseñas de libros utilizando MongoDB como base de datos. Permite a los usuarios crear, leer, actualizar y eliminar reseñas, así como funcionalidades avanzadas como me gusta, reportes, moderación y estadísticas.

## Características

### Funcionalidades Principales
- ✅ **CRUD completo** de reseñas
- ✅ **Autenticación JWT** requerida para todas las operaciones
- ✅ **Paginación** avanzada con metadatos
- ✅ **Filtros** múltiples (estado, libro, usuario, calificación)
- ✅ **Validación** exhaustiva de datos de entrada
- ✅ **Sistema de me gusta** (dar/quitar)
- ✅ **Sistema de reportes** con motivos
- ✅ **Moderación** (aprobar/rechazar reseñas)
- ✅ **Estadísticas** detalladas por libro o generales
- ✅ **Soft delete** (eliminación lógica)
- ✅ **Prevención de duplicados** (un usuario por libro)

### Tecnologías Utilizadas
- **NestJS** - Framework de Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de datos

## Estructura del Módulo

```
resenas-libros/
├── dto/
│   ├── crear-resena.dto.ts     # DTO para crear reseñas
│   └── actualizar-resena.dto.ts # DTOs para actualizar, filtros, etc.
├── schemas/
│   └── resena.schema.ts        # Schema de Mongoose
├── resenas-libros.controller.ts # Controlador con endpoints
├── resenas-libros.service.ts   # Lógica de negocio
├── resenas-libros.module.ts    # Configuración del módulo
└── README.md                   # Documentación
```

## Schema de la Base de Datos

### Modelo de Reseña
```typescript
{
  idLibro: number,           // ID del libro (requerido)
  idUsuario: number,         // ID del usuario (requerido)
  calificacion: number,      // Calificación de 1-5 (requerido)
  comentario?: string,       // Comentario opcional (máx. 1000 caracteres)
  meGusta: string[],         // Array de IDs de usuarios que dieron me gusta
  noMeGusta: string[],       // Array de IDs de usuarios que dieron no me gusta
  estaActivo: boolean,       // Estado activo/inactivo (soft delete)
  estado: string,            // 'pendiente' | 'aprobada' | 'rechazada'
  reportes: Array<{          // Array de reportes
    usuarioId: string,
    motivo: string,
    fecha: Date
  }>,
  fechaCreacion: Date,       // Fecha de creación
  fechaActualizacion: Date,  // Fecha de última actualización
}
```

### Índices Optimizados
- `{ idLibro: 1, idUsuario: 1 }` - Único (previene duplicados)
- `{ idLibro: 1, calificacion: -1 }` - Para búsquedas por libro
- `{ idUsuario: 1, fechaCreacion: -1 }` - Para reseñas por usuario
- `{ estado: 1, estaActivo: 1 }` - Para filtros de moderación

## API Endpoints

### Autenticación
Todos los endpoints requieren autenticación JWT. El token debe enviarse en el header `Authorization: Bearer <token>`.

### Endpoints Principales

#### 1. Crear Reseña
```http
POST /resenas-libros
Content-Type: application/json
Authorization: Bearer <token>

{
  "idLibro": 1,
  "idUsuario": 1,
  "calificacion": 5,
  "comentario": "Excelente libro, muy recomendado"
}
```

**Validaciones:**
- `idLibro`: Requerido, número entero positivo
- `idUsuario`: Requerido, número entero positivo
- `calificacion`: Requerida, entre 1 y 5
- `comentario`: Opcional, máximo 1000 caracteres
- Previene duplicados (un usuario por libro)

#### 2. Obtener Reseñas (con paginación y filtros)
```http
GET /resenas-libros?page=1&limit=10&estado=aprobada&idLibro=1&calificacionMinima=4

Parámetros opcionales:
- page: Número de página (default: 1)
- limit: Elementos por página (default: 10)
- estado: 'pendiente' | 'aprobada' | 'rechazada'
- idLibro: Filtrar por libro específico
- idUsuario: Filtrar por usuario específico
- calificacionMinima: Calificación mínima
- calificacionMaxima: Calificación máxima
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Reseñas obtenidas correctamente",
  "data": {
    "items": [...],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### 3. Obtener Reseñas por Libro
```http
GET /resenas-libros/libro/:idLibro?page=1&limit=10&estado=aprobada
```

#### 4. Obtener Reseñas por Usuario
```http
GET /resenas-libros/usuario/:idUsuario?page=1&limit=10
```

#### 5. Obtener Mis Reseñas
```http
GET /resenas-libros/mis-resenas?page=1&limit=10
```

#### 6. Obtener Reseña por ID
```http
GET /resenas-libros/:id
```

#### 7. Actualizar Reseña
```http
PUT /resenas-libros/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "comentario": "Actualización del comentario",
  "calificacion": 4
}
```
*Solo el propietario o admin puede actualizar*

#### 8. Eliminar Reseña (Soft Delete)
```http
DELETE /resenas-libros/:id
Authorization: Bearer <token>
```
*Solo el propietario o admin puede eliminar*

#### 9. Dar/Quitar Me Gusta
```http
PATCH /resenas-libros/:id/me-gusta
Authorization: Bearer <token>
```

#### 10. Reportar Reseña
```http
PATCH /resenas-libros/:id/reportar
Content-Type: application/json
Authorization: Bearer <token>

{
  "motivo": "Contenido inapropiado"
}
```

#### 11. Aprobar Reseña (Solo Admin)
```http
PATCH /resenas-libros/:id/aprobar
Authorization: Bearer <token>
```

#### 12. Rechazar Reseña (Solo Admin)
```http
PATCH /resenas-libros/:id/rechazar
Authorization: Bearer <token>
```

#### 13. Obtener Estadísticas
```http
GET /resenas-libros/estadisticas?idLibro=1

Respuesta:
{
  "success": true,
  "data": {
    "totalResenas": 100,
    "promedioCalificacion": 4.2,
    "distribucionCalificaciones": {
      "1": 5,
      "2": 10,
      "3": 20,
      "4": 35,
      "5": 30
    },
    "resenasUltimoMes": 15,
    "resenasAprobadas": 85,
    "resenasPendientes": 10,
    "resenasRechazadas": 5
  }
}
```

## DTOs y Validaciones

### CrearResenaDto
```typescript
{
  idLibro: number;        // @IsPositive() @IsNotEmpty()
  idUsuario: number;      // @IsPositive() @IsNotEmpty()
  calificacion: number;   // @IsInt() @Min(1) @Max(5)
  comentario?: string;    // @IsOptional() @IsString() @MaxLength(1000)
}
```

### ActualizarResenaDto
```typescript
{
  comentario?: string;    // @IsOptional() @IsString() @MaxLength(1000)
  estaActivo?: boolean;   // @IsOptional() @IsBoolean()
  estado?: string;        // @IsOptional() @IsEnum(['pendiente', 'aprobada', 'rechazada'])
}
```

### FiltroResenasDto
```typescript
{
  estado?: string;             // @IsOptional() @IsEnum()
  idLibro?: string;           // @IsOptional() @IsString()
  idUsuario?: string;         // @IsOptional() @IsString()
  calificacionMinima?: string; // @IsOptional() @IsString()
  calificacionMaxima?: string; // @IsOptional() @IsString()
}
```

## Manejo de Errores

### Errores Comunes
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: Token JWT inválido o faltante
- `403 Forbidden`: Sin permisos para la operación
- `404 Not Found`: Reseña no encontrada
- `409 Conflict`: Usuario ya reseñó este libro

### Ejemplo de Respuesta de Error
```json
{
  "success": false,
  "message": "El usuario ya ha reseñado este libro",
  "statusCode": 409,
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

## Seguridad y Permisos

### Niveles de Acceso
1. **Usuario Autenticado**: Puede crear, ver y gestionar sus propias reseñas
2. **Propietario de Reseña**: Puede actualizar y eliminar sus reseñas
3. **Administrador**: Puede aprobar, rechazar y gestionar todas las reseñas

### Validaciones de Seguridad
- Autenticación JWT obligatoria
- Verificación de propietario para actualizaciones/eliminaciones
- Validación de roles para operaciones administrativas
- Prevención de inyección NoSQL
- Sanitización de datos de entrada

## Configuración y Uso

### Instalación de Dependencias
```bash
npm install @nestjs/mongoose mongoose
npm install class-validator class-transformer
npm install @nestjs/jwt @nestjs/passport passport-jwt
```

### Configuración en app.module.ts
```typescript
import { MongooseModule } from '@nestjs/mongoose';
import { ResenasLibrosModule } from './resenas-libros/resenas-libros.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/biblioteca'),
    ResenasLibrosModule,
  ],
})
export class AppModule {}
```

### Variables de Entorno
```env
MONGODB_URI=mongodb://localhost:27017/biblioteca
JWT_SECRET=your_jwt_secret_key
```

## Testing

### Pruebas Recomendadas
1. **Unitarias**: Servicios y validaciones
2. **Integración**: Endpoints y base de datos
3. **E2E**: Flujos completos de usuario

### Ejemplo de Test
```typescript
describe('ResenasLibrosService', () => {
  it('debe crear una reseña correctamente', async () => {
    const dto = {
      idLibro: 1,
      idUsuario: 1,
      calificacion: 5,
      comentario: 'Excelente libro'
    };
    const result = await service.crear(dto);
    expect(result.calificacion).toBe(5);
  });
});
```

## Optimizaciones y Mejores Prácticas

### Performance
- Índices optimizados para consultas frecuentes
- Paginación para evitar cargar demasiados datos
- Agregaciones de MongoDB para estadísticas
- Soft delete para mantener integridad referencial

### Escalabilidad
- Separación clara de responsabilidades
- DTOs tipados para validación
- Interfaces bien definidas
- Cacheable con Redis (futuro)

### Mantenibilidad
- Código autodocumentado
- Manejo consistente de errores
- Logging estructurado
- Versionado de API

## Roadmap Futuro

### Características Planeadas
- [ ] Cache con Redis para mejores tiempos de respuesta
- [ ] Notificaciones push para nuevas reseñas
- [ ] Sistema de puntuación de reseñas útiles
- [ ] Integración con sistema de recomendaciones
- [ ] API GraphQL como alternativa
- [ ] Webhooks para eventos de reseñas
- [ ] Métricas y analytics avanzados

## Contribución

Para contribuir al módulo:
1. Fork del repositorio
2. Crear rama feature/nueva-funcionalidad
3. Implementar con tests
4. Actualizar documentación
5. Pull request para revisión

## Soporte

Para reportar bugs o solicitar funcionalidades, crear un issue en el repositorio del proyecto.

---

**Última actualización:** Diciembre 2023
**Versión:** 1.0.0
**Mantenedor:** Equipo de Backend
