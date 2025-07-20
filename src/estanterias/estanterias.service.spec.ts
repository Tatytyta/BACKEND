import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstanteriasService } from './estanterias.service';
import { Estanteria } from './estanterias.entity';
import { CreateEstanteriaDto } from './dto/create-estanteria.dto';
import { UpdateEstanteriaDto } from './dto/update-estanteria.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('EstanteriasService', () => {
  let service: EstanteriasService;
  let repository: Repository<Estanteria>;

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

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstanteriasService,
        {
          provide: getRepositoryToken(Estanteria),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EstanteriasService>(EstanteriasService);
    repository = module.get<Repository<Estanteria>>(getRepositoryToken(Estanteria));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new estanteria', async () => {
      const createDto: CreateEstanteriaDto = {
        codigo: 'EST-001',
        ubicacion: 'Sala Principal - Sección A',
        capacidad: 50,
        descripcion: 'Estantería para libros de ficción',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockEstanteria);
      mockRepository.save.mockResolvedValue(mockEstanteria);

      const result = await service.create(createDto);

      expect(result).toEqual(mockEstanteria);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { codigo: createDto.codigo } });
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockEstanteria);
    });

    it('should throw ConflictException if codigo already exists', async () => {
      const createDto: CreateEstanteriaDto = {
        codigo: 'EST-001',
        ubicacion: 'Sala Principal - Sección A',
        capacidad: 50,
      };

      mockRepository.findOne.mockResolvedValue(mockEstanteria);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a estanteria by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockEstanteria);

      const result = await service.findOne(1);

      expect(result).toEqual(mockEstanteria);
      expect(repository.findOne).toHaveBeenCalledWith({ 
        where: { id: 1 }, 
        relations: ['libros'] 
      });
    });

    it('should throw NotFoundException if estanteria not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a estanteria', async () => {
      const updateDto: UpdateEstanteriaDto = {
        descripcion: 'Descripción actualizada',
      };

      const updatedEstanteria = { ...mockEstanteria, ...updateDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockEstanteria);
      mockRepository.save.mockResolvedValue(updatedEstanteria);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedEstanteria);
      expect(repository.save).toHaveBeenCalledWith(updatedEstanteria);
    });
  });

  describe('remove', () => {
    it('should remove a estanteria', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockEstanteria);
      mockRepository.remove.mockResolvedValue(mockEstanteria);

      const result = await service.remove(1);

      expect(result).toEqual(mockEstanteria);
      expect(repository.remove).toHaveBeenCalledWith(mockEstanteria);
    });

    it('should throw ConflictException if estanteria has books', async () => {
      const estanteriaWithBooks: Estanteria = {
        ...mockEstanteria,
        libros: [{}] as any,
        librosDisponibles: 49,
        porcentajeOcupacion: 2,
        estaLlena: false,
        estaDisponible: true
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(estanteriaWithBooks);

      await expect(service.remove(1)).rejects.toThrow(ConflictException);
    });
  });

  describe('getEstanteriaStats', () => {
    it('should return estanteria statistics', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockEstanteria);

      const result = await service.getEstanteriaStats(1);

      expect(result).toEqual({
        estanteria: mockEstanteria,
        librosCount: 0,
        disponibles: 50,
        porcentajeOcupacion: 0
      });
    });
  });
});
