import { Test, TestingModule } from '@nestjs/testing';
import { EstanteriasController } from './estanterias.controller';
import { EstanteriasService } from './estanterias.service';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { RESPONSE_MESSAGES } from '../common/constants/app.constants';
import { CreateEstanteriaDto } from './dto/create-estanteria.dto';
import { UpdateEstanteriaDto } from './dto/update-estanteria.dto';
import { Estanteria } from './estanterias.entity';
import { BadRequestException } from '@nestjs/common';

describe('EstanteriasController', () => {
  let controller: EstanteriasController;
  let service: EstanteriasService;

  const mockEstanteria: Estanteria = {
    id: 1,
    codigo: 'EST-001',
    ubicacion: 'Sala Principal - Sección A',
    capacidad: 50,
    descripcion: 'Estantería para libros de ficción',
    createdAt: new Date(),
    updatedAt: new Date(),
    libros: [],
    librosDisponibles: 50,
    porcentajeOcupacion: 0,
    estaLlena: false,
    estaDisponible: true
  };

  const mockEstanteriasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCode: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getEstanteriaStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstanteriasController],
      providers: [
        {
          provide: EstanteriasService,
          useValue: mockEstanteriasService,
        },
      ],
    }).compile();

    controller = module.get<EstanteriasController>(EstanteriasController);
    service = module.get<EstanteriasService>(EstanteriasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new estanteria', async () => {
      const createDto: CreateEstanteriaDto = {
        codigo: 'EST-001',
        ubicacion: 'Sala Principal - Sección A',
        capacidad: 50,
        descripcion: 'Estantería para libros de ficción',
      };

      mockEstanteriasService.create.mockResolvedValue(mockEstanteria);

      const result = await controller.create(createDto);

      expect(result).toEqual(new SuccessResponseDto(RESPONSE_MESSAGES.CREATED, mockEstanteria));
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated estanterias', async () => {
      const paginationResult = {
        items: [mockEstanteria],
        meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 }
      };

      mockEstanteriasService.findAll.mockResolvedValue(paginationResult);

      const result = await controller.findAll();

      expect(result).toEqual(new SuccessResponseDto(RESPONSE_MESSAGES.SUCCESS, paginationResult));
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 }, undefined);
    });

    it('should throw BadRequestException for invalid disponible parameter', async () => {
      await expect(controller.findAll(1, 10, 'invalid')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a single estanteria', async () => {
      mockEstanteriasService.findOne.mockResolvedValue(mockEstanteria);

      const result = await controller.findOne(1);

      expect(result).toEqual(new SuccessResponseDto(RESPONSE_MESSAGES.SUCCESS, mockEstanteria));
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findByCode', () => {
    it('should return a estanteria by code', async () => {
      mockEstanteriasService.findByCode.mockResolvedValue(mockEstanteria);

      const result = await controller.findByCode('EST-001');

      expect(result).toEqual(new SuccessResponseDto(RESPONSE_MESSAGES.SUCCESS, mockEstanteria));
      expect(service.findByCode).toHaveBeenCalledWith('EST-001');
    });
  });

  describe('update', () => {
    it('should update a estanteria', async () => {
      const updateDto: UpdateEstanteriaDto = {
        descripcion: 'Descripción actualizada',
      };

      const updatedEstanteria = { ...mockEstanteria, ...updateDto };
      mockEstanteriasService.update.mockResolvedValue(updatedEstanteria);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(new SuccessResponseDto(RESPONSE_MESSAGES.UPDATED, updatedEstanteria));
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a estanteria', async () => {
      mockEstanteriasService.remove.mockResolvedValue(mockEstanteria);

      const result = await controller.remove(1);

      expect(result).toEqual(new SuccessResponseDto(RESPONSE_MESSAGES.DELETED, mockEstanteria));
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('getStats', () => {
    it('should return estanteria statistics', async () => {
      const stats = {
        estanteria: mockEstanteria,
        librosCount: 0,
        disponibles: 50,
        porcentajeOcupacion: 0
      };

      mockEstanteriasService.getEstanteriaStats.mockResolvedValue(stats);

      const result = await controller.getStats(1);

      expect(result).toEqual(new SuccessResponseDto('Estadísticas de estantería obtenidas exitosamente', stats));
      expect(service.getEstanteriaStats).toHaveBeenCalledWith(1);
    });
  });
});
