import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('LocationsService', () => {
  let service: LocationsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: PrismaService,
          useValue: {
            location: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a location', async () => {
      const createLocationDto: CreateLocationDto = {
        name: '',
        latitude: 0,
        longitude: 0,
      };
      jest.spyOn(prismaService.location, 'create').mockResolvedValue({
        id: 1,
        name: 'Test Location',
        latitude: 40.7128,
        longitude: -74.006,
        createdAt: new Date(),
      });
      await expect(service.create(createLocationDto)).resolves.toBeTruthy();
    });

    it('should throw an error if the location cannot be created', async () => {
      const createLocationDto: CreateLocationDto = {
        name: '',
        latitude: 0,
        longitude: 0,
      };
      jest
        .spyOn(prismaService.location, 'create')
        .mockRejectedValue(new Error('Async error'));
      await expect(service.create(createLocationDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const expectedLocations = [];
      jest
        .spyOn(prismaService.location, 'findMany')
        .mockResolvedValue(expectedLocations);
      await expect(service.findAll()).resolves.toEqual(expectedLocations);
    });

    it('should throw an error if something goes wrong', async () => {
      jest
        .spyOn(prismaService.location, 'findMany')
        .mockRejectedValue(new Error('Async error'));
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single location by id', async () => {
      const mockLocationId = 1;
      const mockLocation = {
        id: 1,
        name: 'Test Location',
        latitude: 40.7128,
        longitude: -74.006,
        createdAt: new Date(),
      };
      jest
        .spyOn(prismaService.location, 'findUnique')
        .mockResolvedValue(mockLocation);
      await expect(service.findOne(mockLocationId)).resolves.toEqual(
        mockLocation,
      );
    });

    it('should throw a NotFoundException if the location is not found', async () => {
      const mockLocationId = 999;
      jest.spyOn(prismaService.location, 'findUnique').mockResolvedValue(null);
      await expect(service.findOne(mockLocationId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
