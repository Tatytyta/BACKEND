import { Test, TestingModule } from '@nestjs/testing';
import { GenerosController } from './generos.controller';
import { GenerosService } from './generos.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';

describe('GenerosController', () => {
  let controller: GenerosController;
  let service: GenerosService;

  const mockGenero = {
    id: 1,
    nombre: 'Ficción',
    descripcion: 'Libros de ficción literaria',
    libros: [],
  };

  const mockGenerosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByName: jest.fn(),
    getGeneroStats: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerosController],
      providers: [
        {
          provide: GenerosService,
          useValue: mockGenerosService,
        },
      ],
    }).compile();

    controller = module.get<GenerosController>(GenerosController);
    service = module.get<GenerosService>(GenerosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a genero', async () => {
      const createDto: CreateGeneroDto = {
        nombre: 'Ficción',
        descripcion: 'Libros de ficción literaria',
      };

      mockGenerosService.create.mockResolvedValue(mockGenero);

      const result = await controller.create(createDto);

      expect(result).toEqual({
        message: 'Género creado exitosamente',
        data: mockGenero,
      });
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all generos', async () => {
      mockGenerosService.findAll.mockResolvedValue([mockGenero]);

      const result = await controller.findAll();

      expect(result).toEqual({
        message: 'Géneros obtenidos exitosamente',
        data: [mockGenero],
      });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a genero by id', async () => {
      mockGenerosService.findOne.mockResolvedValue(mockGenero);

      const result = await controller.findOne(1);

      expect(result).toEqual({
        message: 'Género obtenido exitosamente',
        data: mockGenero,
      });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a genero', async () => {
      const updateDto: UpdateGeneroDto = {
        descripcion: 'Nueva descripción',
      };

      mockGenerosService.update.mockResolvedValue({ ...mockGenero, ...updateDto });

      const result = await controller.update(1, updateDto);

      expect(result).toEqual({
        message: 'Género actualizado exitosamente',
        data: { ...mockGenero, ...updateDto },
      });
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a genero', async () => {
      mockGenerosService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toEqual({
        message: 'Género eliminado exitosamente',
      });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
