import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesService } from './episodes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';

describe('EpisodesService', () => {
  let service: EpisodesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpisodesService,
        {
          provide: PrismaService,
          useValue: {
            episode: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
            character: {
              count: jest.fn(),
            },
            comment: {
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<EpisodesService>(EpisodesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      jest.spyOn(prismaService.episode, 'create').mockResolvedValue(result);
      jest.spyOn(prismaService.character, 'count').mockResolvedValue(2);

      expect(await service.create(createEpisodeDto)).toBe(result);
    });

    it('should throw NotFoundException if one or more characterIds do not exist', async () => {
      const createEpisodeDto: CreateEpisodeDto = {
        name: 'Test Episode',
        releaseDate: new Date(),
        episodeCode: 'EP001',
        characterIds: [1, 2],
        comments: [
          { comment: 'Great episode!', ipAddressLocation: '127.0.0.1' },
        ],
      };

      jest.spyOn(prismaService.character, 'count').mockResolvedValue(1);

      await expect(service.create(createEpisodeDto)).rejects.toThrow(
        NotFoundException,
      );
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

      jest.spyOn(prismaService.episode, 'findMany').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single episode by id', async () => {
      const mockEpisodeId = 1;
      const result = {
        id: 1,
        name: 'Test Episode',
        releaseDate: new Date(),
        episodeCode: 'EP001',
        createdAt: new Date(),
        characters: [],
        comments: [],
      };

      jest.spyOn(prismaService.episode, 'findUnique').mockResolvedValue(result);

      expect(await service.findOne(mockEpisodeId)).toBe(result);
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

      jest.spyOn(prismaService.episode, 'findMany').mockResolvedValue(result);

      expect(await service.findEpisodesByCharacter(mockCharacterId)).toBe(
        result,
      );
    });

    it('should throw NotFoundException if invalid characterId provided', async () => {
      const mockCharacterId = 'invalid';

      await expect(
        service.findEpisodesByCharacter(mockCharacterId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
