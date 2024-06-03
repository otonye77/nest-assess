import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto, CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EpisodesService {
  constructor(private prisma: PrismaService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(createEpisodeDto: CreateEpisodeDto) {
    const { characterIds, comments, ...episodeData } = createEpisodeDto;

    const charactersCount = await this.prisma.character.count({
      where: { id: { in: characterIds } },
    });

    if (charactersCount !== characterIds.length) {
      throw new NotFoundException(
        'Failed to create episode: One or more provided characterIds do not exist.',
      );
    }

    const episode = await this.prisma.episode.create({
      data: {
        ...episodeData,
        characters: { connect: characterIds.map((id) => ({ id })) },
        comments: {
          create: comments.map((comment: CreateCommentDto) => ({
            comment: comment.comment,
            ipAddressLocation: comment.ipAddressLocation,
          })),
        },
      },
    });

    return episode;
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
