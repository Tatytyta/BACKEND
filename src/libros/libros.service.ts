import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';
import { Genero } from '../generos/genero.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { FiltroLibrosDto } from './dto/filtro-libros.dto';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  async create(createLibroDto: CreateLibroDto): Promise<Libro> {
    // Verificar si el ISBN ya existe
    const existingLibro = await this.libroRepository.findOne({
      where: { ISBN: createLibroDto.ISBN }
    });

    if (existingLibro) {
      throw new ConflictException('Ya existe un libro con este ISBN');
    }

    // Buscar el género si se proporciona
    let genero: Genero | undefined = undefined;
    if (createLibroDto.generoId) {
      const foundGenero = await this.generoRepository.findOne({
        where: { id: createLibroDto.generoId }
      });
      if (!foundGenero) {
        throw new NotFoundException('Género no encontrado');
      }
      genero = foundGenero;
    }

    const libro = this.libroRepository.create({
      titulo: createLibroDto.titulo,
      autor: createLibroDto.autor,
      ISBN: createLibroDto.ISBN,
      ejemplaresDisponibles: createLibroDto.ejemplaresDisponibles || 1,
      ejemplaresTotales: createLibroDto.ejemplaresTotales || 1,
      fechaPublicacion: createLibroDto.fechaPublicacion,
      descripcion: createLibroDto.descripcion,
      genero,
      disponible: (createLibroDto.ejemplaresDisponibles || 1) > 0
    });

    return await this.libroRepository.save(libro);
  }

  async findAll() {
    try {
      const libros = await this.libroRepository.find();
      return libros;
    } catch (error) {
      console.error('Error al obtener libros:', error);
      throw new Error('Error al obtener libros');
    }
  }

  async findOne(id: number): Promise<Libro> {
    const libro = await this.libroRepository.findOne({
      where: { id },
      relations: ['genero', 'prestamos']
    });

    if (!libro) {
      throw new NotFoundException('Libro no encontrado');
    }

    return libro;
  }

  async findByGenero(generoId: number): Promise<Libro[]> {
    return await this.libroRepository.find({
      where: { genero: { id: generoId } },
      relations: ['genero'],
      order: { titulo: 'ASC' }
    });
  }

  async findDisponibles(): Promise<Libro[]> {
    return await this.libroRepository.find({
      where: { disponible: true, ejemplaresDisponibles: 1 },
      relations: ['genero'],
      order: { titulo: 'ASC' }
    });
  }

  async update(id: number, updateLibroDto: UpdateLibroDto): Promise<Libro> {
    const libro = await this.findOne(id);

    // Si se actualiza el ISBN, verificar que no exista otro libro con ese ISBN
    if (updateLibroDto.ISBN && updateLibroDto.ISBN !== libro.ISBN) {
      const existingLibro = await this.libroRepository.findOne({
        where: { ISBN: updateLibroDto.ISBN }
      });
      if (existingLibro) {
        throw new ConflictException('Ya existe un libro con este ISBN');
      }
    }

    // Si se actualiza el género
    if (updateLibroDto.generoId) {
      const genero = await this.generoRepository.findOne({
        where: { id: updateLibroDto.generoId }
      });
      if (!genero) {
        throw new NotFoundException('Género no encontrado');
      }
      libro.genero = genero;
    }

    // Actualizar disponibilidad basada en ejemplares disponibles
    if (updateLibroDto.ejemplaresDisponibles !== undefined) {
      libro.disponible = updateLibroDto.ejemplaresDisponibles > 0;
    }

    Object.assign(libro, updateLibroDto);
    return await this.libroRepository.save(libro);
  }

  async remove(id: number): Promise<void> {
    const libro = await this.findOne(id);
    
    // Verificar si tiene préstamos activos
    const prestamosActivos = libro.prestamos?.filter(
      prestamo => prestamo.estado === 'activo'
    );

    if (prestamosActivos && prestamosActivos.length > 0) {
      throw new ConflictException('No se puede eliminar un libro con préstamos activos');
    }

    await this.libroRepository.remove(libro);
  }

  async search(termino: string): Promise<Libro[]> {
    return await this.libroRepository
      .createQueryBuilder('libro')
      .leftJoinAndSelect('libro.genero', 'genero')
      .where('libro.titulo ILIKE :termino', { termino: `%${termino}%` })
      .orWhere('libro.autor ILIKE :termino', { termino: `%${termino}%` })
      .orWhere('libro.ISBN ILIKE :termino', { termino: `%${termino}%` })
      .orderBy('libro.titulo', 'ASC')
      .getMany();
  }

  async updateDisponibilidad(id: number): Promise<Libro> {
    const libro = await this.findOne(id);
    
    // Contar préstamos activos
    const prestamosActivos = libro.prestamos?.filter(
      prestamo => prestamo.estado === 'activo'
    ).length || 0;

    // Actualizar ejemplares disponibles y disponibilidad
    libro.ejemplaresDisponibles = Math.max(0, libro.ejemplaresTotales - prestamosActivos);
    libro.disponible = libro.ejemplaresDisponibles > 0;

    return await this.libroRepository.save(libro);
  }
}
