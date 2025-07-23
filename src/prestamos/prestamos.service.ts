import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prestamo, EstadoPrestamo } from './prestamo.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { Libro } from '../libros/libro.entity';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { FiltroPrestamosDto } from './dto/filtro-prestamos.dto';

@Injectable()
export class PrestamosService {
  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
  ) {}

  async create(createPrestamoDto: CreatePrestamoDto): Promise<Prestamo> {
    // Verificar que el usuario existe
    const usuario = await this.usuarioRepository.findOne({
      where: { id: createPrestamoDto.usuarioId }
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el libro existe y está disponible
    const libro = await this.libroRepository.findOne({
      where: { id: createPrestamoDto.libroId }
    });
    if (!libro) {
      throw new NotFoundException('Libro no encontrado');
    }
    if (!libro.disponible || libro.ejemplaresDisponibles <= 0) {
      throw new ConflictException('El libro no está disponible para préstamo');
    }

    // Verificar que el usuario no tenga préstamos vencidos
    const prestamosVencidos = await this.prestamoRepository.count({
      where: {
        usuario: { id: createPrestamoDto.usuarioId },
        estado: EstadoPrestamo.VENCIDO
      }
    });
    if (prestamosVencidos > 0) {
      throw new ConflictException('El usuario tiene préstamos vencidos. Debe devolverlos antes de solicitar nuevos préstamos.');
    }

    // Crear el préstamo
    const prestamo = this.prestamoRepository.create({
      usuario,
      libro,
      fechaVencimiento: createPrestamoDto.fechaVencimiento,
      estado: EstadoPrestamo.ACTIVO
    });

    const savedPrestamo = await this.prestamoRepository.save(prestamo);

    // Actualizar disponibilidad del libro
    libro.ejemplaresDisponibles--;
    libro.disponible = libro.ejemplaresDisponibles > 0;
    await this.libroRepository.save(libro);

    return savedPrestamo;
  }

  async findAll() {
    try {
      return await this.prestamoRepository.find({
        relations: ['usuario', 'libro', 'libro.genero'],
        order: { fechaInicio: 'DESC' }
      });
    } catch (error) {
      console.error('Error en findAll de PrestamosService:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Prestamo> {
    const prestamo = await this.prestamoRepository.findOne({
      where: { id },
      relations: ['usuario', 'libro', 'libro.genero']
    });

    if (!prestamo) {
      throw new NotFoundException('Préstamo no encontrado');
    }

    return prestamo;
  }

  async findByUsuario(usuarioId: number): Promise<Prestamo[]> {
    return await this.prestamoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['libro', 'libro.genero'],
      order: { fechaInicio: 'DESC' }
    });
  }

  async findActivos(): Promise<Prestamo[]> {
    return await this.prestamoRepository.find({
      where: { estado: EstadoPrestamo.ACTIVO },
      relations: ['usuario', 'libro'],
      order: { fechaVencimiento: 'ASC' }
    });
  }

  async findVencidos(): Promise<Prestamo[]> {
    const hoy = new Date();
    return await this.prestamoRepository
      .createQueryBuilder('prestamo')
      .leftJoinAndSelect('prestamo.usuario', 'usuario')
      .leftJoinAndSelect('prestamo.libro', 'libro')
      .where('prestamo.estado = :estado', { estado: EstadoPrestamo.ACTIVO })
      .andWhere('prestamo.fechaVencimiento < :hoy', { hoy })
      .orderBy('prestamo.fechaVencimiento', 'ASC')
      .getMany();
  }

  async update(id: number, updatePrestamoDto: UpdatePrestamoDto): Promise<Prestamo> {
    const prestamo = await this.findOne(id);
    
    Object.assign(prestamo, updatePrestamoDto);
    return await this.prestamoRepository.save(prestamo);
  }

  async devolver(id: number): Promise<Prestamo> {
    const prestamo = await this.findOne(id);

    if (prestamo.estado !== EstadoPrestamo.ACTIVO) {
      throw new BadRequestException('El préstamo no está activo');
    }

    // Actualizar el préstamo
    prestamo.estado = EstadoPrestamo.DEVUELTO;
    prestamo.fechaFin = new Date();

    const savedPrestamo = await this.prestamoRepository.save(prestamo);

    // Actualizar disponibilidad del libro
    const libro = prestamo.libro;
    libro.ejemplaresDisponibles++;
    libro.disponible = true;
    await this.libroRepository.save(libro);

    return savedPrestamo;
  }

  async remove(id: number): Promise<void> {
    const prestamo = await this.findOne(id);
    
    // Si el préstamo está activo, devolver el libro antes de eliminar
    if (prestamo.estado === EstadoPrestamo.ACTIVO) {
      await this.devolver(id);
    }

    await this.prestamoRepository.remove(prestamo);
  }

  // Método para marcar préstamos vencidos
  async marcarVencidos(): Promise<void> {
    const hoy = new Date();
    await this.prestamoRepository
      .createQueryBuilder()
      .update(Prestamo)
      .set({ estado: EstadoPrestamo.VENCIDO })
      .where('estado = :estadoActivo', { estadoActivo: EstadoPrestamo.ACTIVO })
      .andWhere('fechaVencimiento < :hoy', { hoy })
      .execute();
  }

  // Estadísticas básicas
  async getEstadisticas(): Promise<any> {
    const [
      totalPrestamos,
      prestamosActivos,
      prestamosVencidos,
      prestamosDevueltos
    ] = await Promise.all([
      this.prestamoRepository.count(),
      this.prestamoRepository.count({ where: { estado: EstadoPrestamo.ACTIVO } }),
      this.prestamoRepository.count({ where: { estado: EstadoPrestamo.VENCIDO } }),
      this.prestamoRepository.count({ where: { estado: EstadoPrestamo.DEVUELTO } })
    ]);

    return {
      total: totalPrestamos,
      activos: prestamosActivos,
      vencidos: prestamosVencidos,
      devueltos: prestamosDevueltos
    };
  }
}
