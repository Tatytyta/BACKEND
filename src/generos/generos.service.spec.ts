import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerosService } from './generos.service';
import { Genero } from './genero.entity';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('GenerosService', () => {
  let service: GenerosService;
  let repository: Repository<Genero>;

  const mockGenero: Genero = {
    id: 1,
    nombre: 'Ficción',
    descripcion: 'Libros de ficción literaria',
    libros: [],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerosService,
        {
          provide: getRepositoryToken(Genero),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GenerosService>(GenerosService);
    repository = module.get<Repository<Genero>>(getRepositoryToken(Genero));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new genero', async () => {
      const createDto: CreateGeneroDto = {
        nombre: 'Ficción',
        descripcion: 'Libros de ficción literaria',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockGenero);
      mockRepository.save.mockResolvedValue(mockGenero);

      const result = await service.create(createDto);

      expect(result).toEqual(mockGenero);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { nombre: createDto.nombre } });
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockGenero);
    });

    it('should throw ConflictException if genero already exists', async () => {
      const createDto: CreateGeneroDto = {
        nombre: 'Ficción',
        descripcion: 'Libros de ficción literaria',
      };

      mockRepository.findOne.mockResolvedValue(mockGenero);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all generos', async () => {
      mockRepository.find.mockResolvedValue([mockGenero]);

      const result = await service.findAll();

      expect(result).toEqual([mockGenero]);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['libros'],
        order: { nombre: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a genero by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockGenero);

      const result = await service.findOne(1);

      expect(result).toEqual(mockGenero);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['libros'],
      });
    });

    it('should throw NotFoundException if genero not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a genero', async () => {
      const updateDto: UpdateGeneroDto = {
        descripcion: 'Nueva descripción',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockGenero);
      mockRepository.save.mockResolvedValue({ ...mockGenero, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(result).toEqual({ ...mockGenero, ...updateDto });
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a genero', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockGenero);
      mockRepository.remove.mockResolvedValue(mockGenero);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(mockGenero);
    });

    it('should throw ConflictException if genero has books', async () => {
      const generoWithBooks = { ...mockGenero, libros: [{}] as any };
      jest.spyOn(service, 'findOne').mockResolvedValue(generoWithBooks);

      await expect(service.remove(1)).rejects.toThrow(ConflictException);
    });
  });
});
