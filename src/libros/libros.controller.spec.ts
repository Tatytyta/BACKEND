import { Test, TestingModule } from '@nestjs/testing';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';

describe('LibrosController', () => {
  let controller: LibrosController;
  let service: LibrosService;

  const mockLibro = {
    id: 1,
    titulo: 'El Quijote',
    autor: 'Miguel de Cervantes',
    ISBN: '978-84-376-0494-7',
    genero: { id: 1, nombre: 'Ficción' },
    estanteria: { id: 1, codigo: 'EST-001' },
    ejemplaresDisponibles: 3,
    fechaPublicacion: new Date('1605-01-16'),
    prestamos: [],
  };

  const mockLibrosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findDisponibles: jest.fn(),
    searchLibros: jest.fn(),
    findByTitle: jest.fn(),
    findByAutor: jest.fn(),
    findByISBN: jest.fn(),
    findByGenero: jest.fn(),
    findByEstanteria: jest.fn(),
    getLibroStats: jest.fn(),
    update: jest.fn(),
    updateEjemplaresDisponibles: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrosController],
      providers: [
        {
          provide: LibrosService,
          useValue: mockLibrosService,
        },
      ],
    }).compile();

    controller = module.get<LibrosController>(LibrosController);
    service = module.get<LibrosService>(LibrosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a libro', async () => {
      const createDto: CreateLibroDto = {
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        ISBN: '978-84-376-0494-7',
        generoId: 1,
        estanteriaId: 1,
        ejemplaresDisponibles: 3,
        fechaPublicacion: new Date('1605-01-16'),
      };

      mockLibrosService.create.mockResolvedValue(mockLibro);

      const result = await controller.create(createDto);

      expect(result).toEqual({
        message: 'Libro creado exitosamente',
        data: mockLibro,
      });
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all libros', async () => {
      const paginationResult = {
        items: [mockLibro],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      mockLibrosService.findAll.mockResolvedValue(paginationResult);

      const result = await controller.findAll(1, 10);

      expect(result).toEqual({
        message: 'Libros obtenidos exitosamente',
        data: paginationResult,
      });
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe('findOne', () => {
    it('should return a libro by id', async () => {
      mockLibrosService.findOne.mockResolvedValue(mockLibro);

      const result = await controller.findOne(1);

      expect(result).toEqual({
        message: 'Libro obtenido exitosamente',
        data: mockLibro,
      });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a libro', async () => {
      const updateDto: UpdateLibroDto = {
        titulo: 'El Quijote - Edición Actualizada',
      };

      mockLibrosService.update.mockResolvedValue({ ...mockLibro, ...updateDto });

      const result = await controller.update(1, updateDto);

      expect(result).toEqual({
        message: 'Libro actualizado exitosamente',
        data: { ...mockLibro, ...updateDto },
      });
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a libro', async () => {
      mockLibrosService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toEqual({
        message: 'Libro eliminado exitosamente',
      });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
