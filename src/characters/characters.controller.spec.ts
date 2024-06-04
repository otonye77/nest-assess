import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { BadRequestException } from '@nestjs/common';

describe('CharactersController', () => {
  let controller: CharactersController;
  let service: CharactersService;

  beforeEach(async () => {
    const mockCharactersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        { provide: CharactersService, useValue: mockCharactersService },
      ],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
    service = module.get<CharactersService>(CharactersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const mockCharacter = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    gender: 'MALE',
    status: 'ACTIVE',
    stateOfOrigin: 'Rivers',
    locationId: 1,
    location: {
      id: 1,
      name: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      createdAt: new Date(),
    },
    episodes: [
      {
        id: 1,
        name: 'Episode 1',
        releaseDate: new Date(),
        episodeCode: 'S01E01',
        createdAt: new Date(),
      },
      {
        id: 2,
        name: 'Episode 2',
        releaseDate: new Date(),
        episodeCode: 'S01E02',
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
  };

  const mockCreateCharacterDto: CreateCharacterDto = {
    firstName: 'John',
    lastName: 'Doe',
    gender: 'MALE',
    status: 'ACTIVE',
    stateOfOrigin: 'Rivers',
    locationId: 1,
    episodeIds: [1, 2],
  };

  const mockUpdateCharacterDto: UpdateCharacterDto = {
    firstName: 'Jane',
    lastName: 'Doe',
    gender: 'FEMALE',
    status: 'ACTIVE',
    stateOfOrigin: 'Lagos',
    locationId: 2,
    episodeIds: [1, 2],
  };

  describe('create', () => {
    it('should create a character', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockCharacter);

      const result = await controller.create(mockCreateCharacterDto);

      expect(result).toEqual(mockCharacter);
      expect(service.create).toHaveBeenCalledWith(mockCreateCharacterDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of characters', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockCharacter]);

      const result = await controller.findAll(
        'asc',
        'MALE',
        'MALE',
        'ACTIVE',
        'New York',
      );

      expect(result).toEqual([mockCharacter]);
      expect(service.findAll).toHaveBeenCalledWith(
        'asc',
        'MALE',
        'MALE',
        'ACTIVE',
        'New York',
      );
    });

    it('should throw an error if gender is invalid', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(
          new BadRequestException(
            'Invalid gender. Gender must be either "MALE" or "FEMALE".',
          ),
        );

      await expect(
        controller.findAll(
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
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(
          new BadRequestException(
            'Invalid status. Status must be either "ACTIVE", "DEAD", or "UNKNOWN".',
          ),
        );

      await expect(
        controller.findAll('asc', 'MALE', 'MALE', 'INVALID_STATUS', 'New York'),
      ).rejects.toThrowError(
        new BadRequestException(
          'Invalid status. Status must be either "ACTIVE", "DEAD", or "UNKNOWN".',
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should return a character', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCharacter);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockCharacter);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a character', async () => {
      const updatedCharacter = { ...mockCharacter, ...mockUpdateCharacterDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedCharacter);

      const result = await controller.update('1', mockUpdateCharacterDto);

      expect(result).toEqual(updatedCharacter);
      expect(service.update).toHaveBeenCalledWith(1, mockUpdateCharacterDto);
    });
  });

  describe('remove', () => {
    it('should remove a character', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockCharacter);

      const result = await controller.remove('1');

      expect(result).toEqual(mockCharacter);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
