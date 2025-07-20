import { Test, TestingModule } from '@nestjs/testing';
import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamos.dto';
import { UpdatePrestamoDto, DevolucionPrestamoDto, RenovarPrestamoDto } from './dto/update-prestamos.dto';
import { EstadoPrestamo } from './prestamo.entity';

describe('PrestamosController', () => {
  let controller: PrestamosController;
  let service: PrestamosService;

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
    libro: { id: 1, titulo: 'El Quijote' }
  };

  const mockPrestamosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUsuario: jest.fn(),
    findByLibro: jest.fn(),
    findByEstado: jest.fn(),
    findVencidos: jest.fn(),
    getEstadisticas: jest.fn(),
    devolver: jest.fn(),
    renovar: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    actualizarPrestamosVencidos: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestamosController],
      providers: [
        {
          provide: PrestamosService,
          useValue: mockPrestamosService
        }
      ]
    }).compile();

    controller = module.get<PrestamosController>(PrestamosController);
    service = module.get<PrestamosService>(PrestamosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a prestamo', async () => {
      const createDto: CreatePrestamoDto = {
        usuarioId: 1,
        libroId: 1,
        fechaDevolucionEstimada: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      };

      mockPrestamosService.create.mockResolvedValue(mockPrestamo);

      const result = await controller.create(createDto);

      expect(result).toEqual({
        message: 'Préstamo creado exitosamente',
        data: mockPrestamo
      });
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all prestamos', async () => {
      const paginationResult = {
        items: [mockPrestamo],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1
        }
      };

      mockPrestamosService.findAll.mockResolvedValue(paginationResult);

      const result = await controller.findAll(1, 10);

      expect(result).toEqual({
        message: 'Préstamos obtenidos exitosamente',
        data: paginationResult
      });
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe('findOne', () => {
    it('should return a prestamo by id', async () => {
      mockPrestamosService.findOne.mockResolvedValue(mockPrestamo);

      const result = await controller.findOne(1);

      expect(result).toEqual({
        message: 'Préstamo obtenido exitosamente',
        data: mockPrestamo
      });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('devolver', () => {
    it('should return a prestamo', async () => {
      const devolucionDto: DevolucionPrestamoDto = {
        fechaDevolucionReal: new Date(),
        observaciones: 'Devuelto en buen estado'
      };

      const prestamoDevuelto = {
        ...mockPrestamo,
        estado: EstadoPrestamo.DEVUELTO,
        fechaDevolucionReal: devolucionDto.fechaDevolucionReal
      };

      mockPrestamosService.devolver.mockResolvedValue(prestamoDevuelto);

      const result = await controller.devolver(1, devolucionDto);

      expect(result).toEqual({
        message: 'Préstamo devuelto exitosamente',
        data: prestamoDevuelto
      });
      expect(service.devolver).toHaveBeenCalledWith(1, devolucionDto);
    });
  });

  describe('renovar', () => {
    it('should renew a prestamo', async () => {
      const renovarDto: RenovarPrestamoDto = {
        fechaDevolucionEstimada: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        observaciones: 'Renovación solicitada'
      };

      const prestamoRenovado = {
        ...mockPrestamo,
        estado: EstadoPrestamo.RENOVADO,
        fechaDevolucionEstimada: renovarDto.fechaDevolucionEstimada
      };

      mockPrestamosService.renovar.mockResolvedValue(prestamoRenovado);

      const result = await controller.renovar(1, renovarDto);

      expect(result).toEqual({
        message: 'Préstamo renovado exitosamente',
        data: prestamoRenovado
      });
      expect(service.renovar).toHaveBeenCalledWith(1, renovarDto);
    });
  });

  describe('update', () => {
    it('should update a prestamo', async () => {
      const updateDto: UpdatePrestamoDto = {
        observaciones: 'Observaciones actualizadas'
      };

      const prestamoActualizado = {
        ...mockPrestamo,
        observaciones: updateDto.observaciones
      };

      mockPrestamosService.update.mockResolvedValue(prestamoActualizado);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual({
        message: 'Préstamo actualizado exitosamente',
        data: prestamoActualizado
      });
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a prestamo', async () => {
      mockPrestamosService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toEqual({
        message: 'Préstamo eliminado exitosamente'
      });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('getEstadisticas', () => {
    it('should return prestamos statistics', async () => {
      const estadisticas = {
        totalPrestamos: 100,
        prestamosActivos: 25,
        prestamosDevueltos: 70,
        prestamosVencidos: 5,
        prestamosRenovados: 10,
        multaTotal: 150.00
      };

      mockPrestamosService.getEstadisticas.mockResolvedValue(estadisticas);

      const result = await controller.getEstadisticas();

      expect(result).toEqual({
        message: 'Estadísticas de préstamos obtenidas exitosamente',
        data: estadisticas
      });
      expect(service.getEstadisticas).toHaveBeenCalled();
    });
  });
});
