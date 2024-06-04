import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from './characters.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

describe('CharactersService', () => {
  let service: CharactersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: PrismaService,
          useValue: {
            character: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            episode: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCharacterDto: CreateCharacterDto = {
      firstName: 'John',
      lastName: 'Doe',
      gender: 'MALE',
      status: 'ACTIVE',
      locationId: 1,
      episodeIds: [1, 2],
      stateOfOrigin: 'Rivers',
    };

    it('should create a character', async () => {
      jest.spyOn(prismaService.episode, 'findMany').mockResolvedValue([
        {
          id: 1,
          name: 'Episode 1',
          releaseDate: new Date(),
          episodeCode: 'E01',
          createdAt: new Date(),
        },
        {
          id: 2,
          name: 'Episode 2',
          releaseDate: new Date(),
          episodeCode: 'E02',
          createdAt: new Date(),
        },
      ]);
      jest
        .spyOn(prismaService.character, 'create')
        .mockResolvedValue(createCharacterDto as any);

      const result = await service.create(createCharacterDto);

      expect(result).toEqual(createCharacterDto);
    });

    it('should throw an error if one or more episodes do not exist', async () => {
      jest.spyOn(prismaService.episode, 'findMany').mockResolvedValue([
        {
          id: 1,
          name: 'Episode 1',
          releaseDate: new Date(),
          episodeCode: 'E01',
          createdAt: new Date(),
        },
      ]);

      await expect(service.create(createCharacterDto)).rejects.toThrowError(
        'Failed to create character: One or more provided episodeIds do not exist.',
      );
    });
  });

  describe('findAll', () => {
    const characterResult = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        gender: 'MALE',
        status: 'ACTIVE',
        stateOfOrigin: 'Rivers',
        locationId: 1,
        createdAt: new Date(),
        location: { name: 'New York' },
        episodes: [],
      },
    ];

    it('should return an array of characters', async () => {
      jest
        .spyOn(prismaService.character, 'findMany')
        .mockResolvedValue(characterResult as any);

      const result = await service.findAll(
        'asc',
        'MALE',
        'MALE',
        'ACTIVE',
        'New York',
      );

      expect(result).toEqual(characterResult);
    });

    it('should throw an error if gender is invalid', async () => {
      await expect(
        service.findAll(
          'asc',
          'INVALID_GENDER',
          'INVALID_GENDER',
          'ACTIVE',
          'New York',
        ),
      ).rejects.toThrowError(
        new BadRequestException(
          'Invalid gender. Gender must be either "MALE" or "FEMALE".',
        ),
      );
    });

    it('should throw an error if status is invalid', async () => {
      await expect(
        service.findAll('asc', 'MALE', 'MALE', 'INVALID_STATUS', 'New York'),
      ).rejects.toThrowError(
        new BadRequestException(
          'Invalid status. Status must be either "ACTIVE", "DEAD", or "UNKNOWN".',
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should return a character', async () => {
      const character = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        gender: 'MALE',
        status: 'ACTIVE',
        location: { name: 'New York' },
        episodes: [],
      };
      jest
        .spyOn(prismaService.character, 'findUnique')
        .mockResolvedValue(character as any);

      const result = await service.findOne(1);

      expect(result).toEqual(character);
    });
  });

  describe('update', () => {
    const updateCharacterDto: UpdateCharacterDto = {
      firstName: 'John',
      lastName: 'Doe',
      gender: 'MALE',
      status: 'ACTIVE',
      locationId: 1,
      episodeIds: [1, 2],
    };

    it('should update a character', async () => {
      const updatedCharacter = { ...updateCharacterDto, id: 1 };
      jest
        .spyOn(prismaService.character, 'update')
        .mockResolvedValue(updatedCharacter as any);

      const result = await service.update(1, updateCharacterDto);

      expect(result).toEqual(updatedCharacter);
    });
  });

  describe('remove', () => {
    it('should remove a character', async () => {
      const character = { id: 1, firstName: 'John', lastName: 'Doe' };
      jest
        .spyOn(prismaService.character, 'delete')
        .mockResolvedValue(character as any);

      const result = await service.remove(1);

      expect(result).toEqual(character);
    });
  });
});
