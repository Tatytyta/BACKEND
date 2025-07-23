import { Controller, Post, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Controller('setup')
export class SetupController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Post('admin')
  async createAdminUser() {
    try {
      // Verificar si ya existe un admin
      const userCount = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM usuarios WHERE role = $1',
        ['administrador']
      );

      if (parseInt(userCount[0].count) > 0) {
        return {
          message: 'Usuario administrador ya existe',
          data: null
        };
      }

      // Crear usuario administrador
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const result = await this.dataSource.query(`
        INSERT INTO usuarios (
          nombre, apellido, email, username, password, telefono, 
          direccion, fecha_nacimiento, tipo, role, activo, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        RETURNING id, username, email, role
      `, [
        'Administrador',
        'Sistema', 
        'admin@biblioteca.com',
        'admin',
        hashedPassword,
        '0000000000',
        'Sistema',
        '1990-01-01',
        'admin',
        'administrador',
        true
      ]);

      return {
        message: 'Usuario administrador creado exitosamente',
        data: result[0]
      };

    } catch (error) {
      return {
        message: 'Error al crear usuario administrador',
        error: error.message,
        data: null
      };
    }
  }

  @Get('status')
  async getSetupStatus() {
    try {
      const result = await this.dataSource.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN role = 'administrador' THEN 1 END) as admin_count
        FROM usuarios
      `);
      
      const totalUsers = parseInt(result[0].total_users);
      const adminCount = parseInt(result[0].admin_count);
      
      return {
        message: 'Estado del sistema',
        data: {
          totalUsers,
          adminCount,
          adminExists: adminCount > 0,
          setupComplete: adminCount > 0
        }
      };
    } catch (error) {
      return {
        message: 'Error al obtener estado (tabla usuarios podría no existir)',
        error: error.message,
        data: {
          totalUsers: 0,
          adminCount: 0,
          adminExists: false,
          setupComplete: false
        }
      };
    }
  }
}
