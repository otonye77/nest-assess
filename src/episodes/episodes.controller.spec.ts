import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { NotFoundException } from '@nestjs/common';

describe('EpisodesController', () => {
  let controller: EpisodesController;
  let service: EpisodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodesController],
      providers: [
        {
          provide: EpisodesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            findEpisodesByCharacter: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EpisodesController>(EpisodesController);
    service = module.get<EpisodesService>(EpisodesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an episode', async () => {
      const createEpisodeDto: CreateEpisodeDto = {
        name: 'Test Episode',
        releaseDate: new Date(),
        episodeCode: 'EP001',
        characterIds: [1, 2],
        comments: [
          { comment: 'Great episode!', ipAddressLocation: '127.0.0.1' },
        ],
      };

      const result = {
        id: 1,
        name: 'Test Episode',
        releaseDate: new Date(),
        episodeCode: 'EP001',
        createdAt: new Date(),
        characters: [],
        comments: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createEpisodeDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of episodes', async () => {
      const result = [
        {
          id: 1,
          name: 'Test Episode',
          releaseDate: new Date(),
          episodeCode: 'EP001',
          createdAt: new Date(),
          characters: [],
          comments: [],
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single episode by id', async () => {
      const mockEpisodeId = '1';
      const result = {
        id: 1,
        name: 'Test Episode',
        releaseDate: new Date(),
        episodeCode: 'EP001',
        createdAt: new Date(),
        characters: [],
        comments: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(mockEpisodeId)).toBe(result);
    });

    it('should throw NotFoundException if episode not found', async () => {
      const mockEpisodeId = '999';

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(mockEpisodeId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an episode by id', async () => {
      const mockEpisodeId = '1';

      const result = {
        id: 1,
        name: 'Test Episode',
        releaseDate: new Date(),
        episodeCode: 'EP001',
        createdAt: new Date(),
      };

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove(mockEpisodeId)).toBe(result);
    });
  });

  describe('findEpisodesByCharacter', () => {
    it('should return episodes for a given characterId', async () => {
      const mockCharacterId = '1';
      const result = [
        {
          id: 1,
          name: 'Test Episode',
          releaseDate: new Date(),
          episodeCode: 'EP001',
          createdAt: new Date(),
          characters: [],
          comments: [],
        },
      ];

      jest.spyOn(service, 'findEpisodesByCharacter').mockResolvedValue(result);

      expect(await controller.findEpisodesByCharacter(mockCharacterId)).toBe(
        result,
      );
    });

    it('should throw NotFoundException if invalid characterId provided', async () => {
      const mockCharacterId = 'invalid';

      await expect(
        controller.findEpisodesByCharacter(mockCharacterId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
