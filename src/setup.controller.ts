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
          nombre, email, password, role, activo, "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING id, email, role
      `, [
        'Administrador',
        'admin@biblioteca.com',
        hashedPassword,
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

  @Get('allusers')
  async getAllUsers() {
    try {
      const result = await this.dataSource.query(`
        SELECT id, nombre, email, role, activo, "createdAt"
        FROM usuarios 
        ORDER BY "createdAt" DESC
        LIMIT 10
      `);
      
      return {
        message: 'Todos los usuarios',
        data: result
      };
    } catch (error) {
      return {
        message: 'Error al obtener usuarios',
        error: error.message,
        data: []
      };
    }
  }

  @Get('users')
  async getUsers() {
    try {
      const result = await this.dataSource.query(`
        SELECT id, email, role, activo, "createdAt"
        FROM usuarios 
        WHERE role = 'administrador'
        ORDER BY "createdAt" DESC
        LIMIT 5
      `);
      
      return {
        message: 'Usuarios administradores',
        data: result
      };
    } catch (error) {
      return {
        message: 'Error al obtener usuarios',
        error: error.message,
        data: []
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
