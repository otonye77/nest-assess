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
    return `This action returns all episodes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} episode`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateEpisodeDto: UpdateEpisodeDto) {
    return `This action updates a #${id} episode`;
  }

  remove(id: number) {
    return `This action removes a #${id} episode`;
  }
}
