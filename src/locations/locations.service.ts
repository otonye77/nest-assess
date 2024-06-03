import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_createLocationDto: CreateLocationDto) {
    return this.prisma.location.create({
      data: _createLocationDto,
    });
  }

  findAll() {
    return this.prisma.episode.findMany({
      include: {
        comments: true,
      },
      orderBy: {
        releaseDate: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.episode.findUnique({
      where: { id },
      include: {
        comments: true,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateLocationDto: UpdateLocationDto) {
    return this.prisma.episode.update({
      where: { id },
      data: _updateLocationDto,
    });
  }

  remove(id: number) {
    return this.prisma.episode.delete({
      where: { id },
    });
  }
}
