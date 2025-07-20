import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibrosService } from './libros.service';
import { Libro } from './libros.entity';
import { Genero } from '../generos/genero.entity';
import { Estanteria } from '../estanterias/estanterias.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('LibrosService', () => {
  let service: LibrosService;
  let libroRepository: Repository<Libro>;
  let generoRepository: Repository<Genero>;
  let estanteriaRepository: Repository<Estanteria>;

  const mockGenero = {
    id: 1,
    nombre: 'Ficción',
    descripcion: 'Libros de ficción',
  };

  const mockEstanteria = {
    id: 1,
    codigo: 'EST-001',
    ubicacion: 'Sala Principal',
    capacidad: 100,
  };

  const mockLibro: Libro = {
    id: 1,
    titulo: 'El Quijote',
    autor: 'Miguel de Cervantes',
    ISBN: '978-84-376-0494-7',
    genero: mockGenero as Genero,
    estanteria: mockEstanteria as Estanteria,
    ejemplaresDisponibles: 3,
    fechaPublicacion: new Date('1605-01-16'),
    prestamos: [],
  };

  const mockLibroRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockGeneroRepository = {
    findOne: jest.fn(),
  };

  const mockEstanteriaRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibrosService,
        {
          provide: getRepositoryToken(Libro),
          useValue: mockLibroRepository,
        },
        {
          provide: getRepositoryToken(Genero),
          useValue: mockGeneroRepository,
        },
        {
          provide: getRepositoryToken(Estanteria),
          useValue: mockEstanteriaRepository,
        },
      ],
    }).compile();

    service = module.get<LibrosService>(LibrosService);
    libroRepository = module.get<Repository<Libro>>(getRepositoryToken(Libro));
    generoRepository = module.get<Repository<Genero>>(getRepositoryToken(Genero));
    estanteriaRepository = module.get<Repository<Estanteria>>(getRepositoryToken(Estanteria));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new libro', async () => {
      const createDto: CreateLibroDto = {
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        ISBN: '978-84-376-0494-7',
        generoId: 1,
        estanteriaId: 1,
        ejemplaresDisponibles: 3,
        fechaPublicacion: new Date('1605-01-16'),
      };

      mockLibroRepository.findOne.mockResolvedValue(null);
      mockGeneroRepository.findOne.mockResolvedValue(mockGenero);
      mockEstanteriaRepository.findOne.mockResolvedValue(mockEstanteria);
      mockLibroRepository.create.mockReturnValue(mockLibro);
      mockLibroRepository.save.mockResolvedValue(mockLibro);

      const result = await service.create(createDto);

      expect(result).toEqual(mockLibro);
      expect(libroRepository.findOne).toHaveBeenCalledWith({ where: { ISBN: createDto.ISBN } });
      expect(generoRepository.findOne).toHaveBeenCalledWith({ where: { id: createDto.generoId } });
      expect(estanteriaRepository.findOne).toHaveBeenCalledWith({ where: { id: createDto.estanteriaId } });
    });

    it('should throw ConflictException if ISBN already exists', async () => {
      const createDto: CreateLibroDto = {
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        ISBN: '978-84-376-0494-7',
        generoId: 1,
        estanteriaId: 1,
      };

      mockLibroRepository.findOne.mockResolvedValue(mockLibro);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if genero does not exist', async () => {
      const createDto: CreateLibroDto = {
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        ISBN: '978-84-376-0494-7',
        generoId: 999,
        estanteriaId: 1,
      };

      mockLibroRepository.findOne.mockResolvedValue(null);
      mockGeneroRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a libro by id', async () => {
      mockLibroRepository.findOne.mockResolvedValue(mockLibro);

      const result = await service.findOne(1);

      expect(result).toEqual(mockLibro);
      expect(libroRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['genero', 'estanteria', 'prestamos'],
      });
    });

    it('should throw NotFoundException if libro not found', async () => {
      mockLibroRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a libro', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockLibro);
      mockLibroRepository.remove.mockResolvedValue(mockLibro);

      await service.remove(1);

      expect(libroRepository.remove).toHaveBeenCalledWith(mockLibro);
    });

    it('should throw ConflictException if libro has prestamos', async () => {
      const libroWithPrestamos = { ...mockLibro, prestamos: [{}] as any };
      jest.spyOn(service, 'findOne').mockResolvedValue(libroWithPrestamos);

      await expect(service.remove(1)).rejects.toThrow(ConflictException);
    });
  });
});
