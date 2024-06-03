import { Injectable } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(createCharacterDto: CreateCharacterDto) {
    const { episodeIds, ...characterData } = createCharacterDto;
    try {
      const episodes = await this.prisma.episode.findMany({
        where: {
          id: {
            in: episodeIds,
          },
        },
      });

      if (episodes.length !== episodeIds.length) {
        throw new Error('One or more provided episodeIds do not exist.');
      }
      const character = await this.prisma.character.create({
        data: {
          ...characterData,
          episodes: {
            connect: episodeIds.map((id) => ({ id })),
          },
        },
      });

      return character;
    } catch (error) {
      throw new Error(`Failed to create character: ${error.message}`);
    }
  }

  findAll(sort: string, filter: string) {
    let orderBy = {};
    if (sort) {
      orderBy = { firstName: sort };
    }
    let where = {};
    if (filter) {
      where = { gender: filter };
    }
    return this.prisma.character.findMany({
      where,
      orderBy,
      include: {
        location: true,
        episodes: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.character.findUnique({
      where: { id },
      include: {
        location: true,
        episodes: true,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateCharacterDto: UpdateCharacterDto) {
    return `This action updates a #${id} character`;
  }

  remove(id: number) {
    return `This action removes a #${id} character`;
  }
}
