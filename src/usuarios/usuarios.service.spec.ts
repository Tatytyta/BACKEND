import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repository: jest.Mocked<Repository<Usuario>>;

  const mockUsuario: Usuario = {
    id: 1,
    nombre: 'Test Usuario',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'usuario',
    activo: true,
    tokenVersion: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    prestamos: []
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    repository = module.get(getRepositoryToken(Usuario));

    // Limpiar mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crear', () => {
    const createDto: CreateUsuarioDto = {
      nombre: 'Test Usuario',
      email: 'test@example.com',
      password: 'Password123',
      role: 'usuario'
    };

    it('debería crear un usuario exitosamente', async () => {
      repository.findOne.mockResolvedValueOnce(null); // Email no existe
      repository.findOne.mockResolvedValueOnce(null); // Nombre no existe
      repository.create.mockReturnValue(mockUsuario);
      repository.save.mockResolvedValue(mockUsuario);

      const result = await service.crear(createDto);

      expect(result).toEqual(mockUsuario);
      expect(repository.findOne).toHaveBeenCalledTimes(2);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('debería lanzar ConflictException si el email ya existe', async () => {
      repository.findOne.mockResolvedValueOnce(mockUsuario); // Email existe

      await expect(service.crear(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('obtenerPorId', () => {
    it('debería retornar un usuario por ID', async () => {
      repository.findOne.mockResolvedValue(mockUsuario);

      const result = await service.obtenerPorId(1);

      expect(result).toEqual(mockUsuario);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['prestamos']
      });
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.obtenerPorId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('buscarUsuarios', () => {
    it('debería buscar usuarios por término', async () => {
      repository.find.mockResolvedValue([mockUsuario]);

      const result = await service.buscarUsuarios('test', 5);

      expect(result).toEqual([mockUsuario]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  // Pruebas para métodos de compatibilidad
  describe('métodos de compatibilidad', () => {
    it('findByEmail debería retornar usuario o null', async () => {
      repository.findOne.mockResolvedValue(mockUsuario);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUsuario);
    });

    it('findByNombre debería retornar usuario o null', async () => {
      repository.findOne.mockResolvedValue(mockUsuario);

      const result = await service.findByNombre('Test Usuario');

      expect(result).toEqual(mockUsuario);
    });

    it('updateTokenVersion debería incrementar la versión del token', async () => {
      const usuarioConTokenActualizado = { ...mockUsuario, tokenVersion: 1 };
      repository.findOne.mockResolvedValue(mockUsuario);
      repository.save.mockResolvedValue(usuarioConTokenActualizado);

      const result = await service.updateTokenVersion(1);

      expect(result).toEqual(usuarioConTokenActualizado);
    });
  });
});
