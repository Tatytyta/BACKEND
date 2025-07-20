import { Test, TestingModule } from '@nestjs/testing';
import { PrestamosService } from './prestamos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prestamo, EstadoPrestamo } from './prestamo.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { Libro } from '../libros/libros.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PrestamosService', () => {
  let service: PrestamosService;
  let prestamoRepository: Repository<Prestamo>;
  let usuarioRepository: Repository<Usuario>;
  let libroRepository: Repository<Libro>;

  const mockPrestamo = {
    id: 1,
    usuarioId: 1,
    libroId: 1,
    fechaPrestamo: new Date(),
    fechaDevolucionEstimada: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    fechaDevolucionReal: null,
    estado: EstadoPrestamo.ACTIVO,
    observaciones: 'Préstamo para estudio',
    diasRetraso: 0,
    multaAcumulada: 0,
    usuario: { id: 1, nombre: 'Juan Pérez' },
    libro: { id: 1, titulo: 'El Quijote', ejemplaresDisponibles: 5 }
  };

  const mockUsuario = {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@test.com'
  };

  const mockLibro = {
    id: 1,
    titulo: 'El Quijote',
    ejemplaresDisponibles: 5
  };

  const mockPrestamoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getRawOne: jest.fn()
    }))
  };

  const mockUsuarioRepository = {
    findOne: jest.fn()
  };

  const mockLibroRepository = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestamosService,
        {
          provide: getRepositoryToken(Prestamo),
          useValue: mockPrestamoRepository
        },
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository
        },
        {
          provide: getRepositoryToken(Libro),
          useValue: mockLibroRepository
        }
      ]
    }).compile();

    service = module.get<PrestamosService>(PrestamosService);
    prestamoRepository = module.get<Repository<Prestamo>>(getRepositoryToken(Prestamo));
    usuarioRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    libroRepository = module.get<Repository<Libro>>(getRepositoryToken(Libro));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new prestamo', async () => {
      const createDto = {
        usuarioId: 1,
        libroId: 1,
        fechaDevolucionEstimada: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUsuario);
      mockLibroRepository.findOne.mockResolvedValue(mockLibro);
      mockPrestamoRepository.count.mockResolvedValueOnce(0); // préstamos vencidos
      mockPrestamoRepository.count.mockResolvedValueOnce(0); // préstamos activos
      mockPrestamoRepository.findOne.mockResolvedValueOnce(null); // no existe préstamo del libro
      mockPrestamoRepository.create.mockReturnValue(mockPrestamo);
      mockPrestamoRepository.save.mockResolvedValue(mockPrestamo);
      mockPrestamoRepository.findOne.mockResolvedValueOnce(mockPrestamo); // findOne final

      const result = await service.create(createDto);

      expect(result).toEqual(mockPrestamo);
      expect(mockPrestamoRepository.create).toHaveBeenCalledWith({
        ...createDto,
        estado: EstadoPrestamo.ACTIVO
      });
      expect(mockLibroRepository.update).toHaveBeenCalledWith(1, {
        ejemplaresDisponibles: 4
      });
    });

    it('should throw NotFoundException if usuario not found', async () => {
      const createDto = {
        usuarioId: 999,
        libroId: 1,
        fechaDevolucionEstimada: new Date()
      };

      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if no ejemplares disponibles', async () => {
      const createDto = {
        usuarioId: 1,
        libroId: 1,
        fechaDevolucionEstimada: new Date()
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUsuario);
      mockLibroRepository.findOne.mockResolvedValue({
        ...mockLibro,
        ejemplaresDisponibles: 0
      });

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a prestamo by id', async () => {
      mockPrestamoRepository.findOne.mockResolvedValue(mockPrestamo);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPrestamo);
      expect(mockPrestamoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['usuario', 'libro']
      });
    });

    it('should throw NotFoundException if prestamo not found', async () => {
      mockPrestamoRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should not remove an active prestamo', async () => {
      mockPrestamoRepository.findOne.mockResolvedValue({
        ...mockPrestamo,
        estado: EstadoPrestamo.ACTIVO
      });

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });

    it('should remove a returned prestamo', async () => {
      const prestamoDevuelto = {
        ...mockPrestamo,
        estado: EstadoPrestamo.DEVUELTO
      };

      mockPrestamoRepository.findOne.mockResolvedValue(prestamoDevuelto);
      mockPrestamoRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockPrestamoRepository.remove).toHaveBeenCalledWith(prestamoDevuelto);
    });
  });
});