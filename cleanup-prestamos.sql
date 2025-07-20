-- Script para limpiar datos problemáticos en la tabla prestamos
-- Ejecutar este script antes de reiniciar la aplicación

-- 1. Eliminar préstamos con usuarioId nulo
DELETE FROM prestamos WHERE "usuarioId" IS NULL;

-- 2. Eliminar préstamos con libroId nulo
DELETE FROM prestamos WHERE "libroId" IS NULL;

-- 3. Verificar que no hay más valores nulos
SELECT COUNT(*) as registros_con_usuario_null FROM prestamos WHERE "usuarioId" IS NULL;
SELECT COUNT(*) as registros_con_libro_null FROM prestamos WHERE "libroId" IS NULL;

-- 4. Mostrar el estado actual de la tabla
SELECT COUNT(*) as total_prestamos FROM prestamos;

-- 5. Si hay registros huérfanos (que referencian usuarios/libros que no existen), eliminarlos
DELETE FROM prestamos 
WHERE "usuarioId" NOT IN (SELECT id FROM usuarios);

DELETE FROM prestamos 
WHERE "libroId" NOT IN (SELECT libros.id FROM libros);

-- 6. Verificación final
SELECT 
    COUNT(*) as total_prestamos,
    COUNT(CASE WHEN "usuarioId" IS NULL THEN 1 END) as usuarios_null,
    COUNT(CASE WHEN "libroId" IS NULL THEN 1 END) as libros_null
FROM prestamos;
