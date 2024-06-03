import { Injectable } from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EpisodesService {
  constructor(private prisma: PrismaService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(_createEpisodeDto: CreateEpisodeDto) {
    return this.prisma.episode.create({
      data: _createEpisodeDto,
    });
  }

  findAll() {
    return this.prisma.location.findMany();
  }

  findOne(id: number) {
    return this.prisma.location.findUnique({
      where: { id },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateEpisodeDto: UpdateEpisodeDto) {
    return this.prisma.location.update({
      where: { id },
      data: _updateEpisodeDto,
    });
  }

  remove(id: number) {
    return this.prisma.location.delete({
      where: { id },
    });
  }
}
