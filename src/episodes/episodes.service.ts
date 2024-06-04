import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto, CreateEpisodeDto } from './dto/create-episode.dto';
// import { UpdateEpisodeDto } from './dto/update-episode.dto';
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

  async findAll() {
    return this.prisma.episode.findMany({
      orderBy: { releaseDate: 'asc' },
      include: {
        comments: {
          select: { id: true },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.episode.findUnique({
      where: { id },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async update(id: number, _updateEpisodeDto: UpdateEpisodeDto) {
  //   return this.prisma.episode.update({
  //     where: { id },
  //     data: _updateEpisodeDto,
  //   });
  // }

  async remove(id: number) {
    await this.prisma.comment.deleteMany({
      where: { episodeId: id },
    });
    return this.prisma.episode.delete({
      where: { id },
    });
  }

  async findEpisodesByCharacter(characterId: string) {
    const parsedCharacterId = parseInt(characterId, 10);

    if (isNaN(parsedCharacterId)) {
      throw new NotFoundException('Invalid characterId provided');
    }

    return this.prisma.episode.findMany({
      where: {
        characters: {
          some: {
            id: parsedCharacterId,
          },
        },
      },
    });
  }
}
