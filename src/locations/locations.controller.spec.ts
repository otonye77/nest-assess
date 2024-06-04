import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { NotFoundException } from '@nestjs/common';

describe('LocationsController', () => {
  let controller: LocationsController;
  let service: LocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [LocationsService],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
    service = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a location', async () => {
      const createLocationDto: CreateLocationDto = {
        name: 'Test Location',
        latitude: 40.7128,
        longitude: -74.006,
      };

      const result = {
        id: 1,
        name: 'Test Location',
        latitude: 40.7128,
        longitude: -74.006,
        createdAt: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createLocationDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const result = [];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single location by id', async () => {
      const mockLocationId = '1';

      const result = {
        id: 1,
        name: 'Test Location',
        latitude: 40.7128,
        longitude: -74.006,
        createdAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(mockLocationId)).toBe(result);
    });

    it('should throw NotFoundException if location not found', async () => {
      const mockLocationId = '999';

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(mockLocationId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
