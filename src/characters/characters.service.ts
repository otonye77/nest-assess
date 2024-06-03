import { BadRequestException, Injectable } from '@nestjs/common';
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

  async findAll(
    sort: string,
    filter: string,
    gender: string,
    status: string,
    location: string,
  ) {
    let orderBy = {};
    if (sort) {
      orderBy = { firstName: sort };
    }
    let where = {};
    if (filter) {
      where = { gender: filter };
    }
    if (gender) {
      if (!['MALE', 'FEMALE'].includes(gender.toUpperCase())) {
        throw new BadRequestException(
          'Invalid gender. Gender must be either "MALE" or "FEMALE".',
        );
      }
      where = { ...where, gender };
    }
    if (status) {
      if (!['ACTIVE', 'DEAD', 'UNKNOWN'].includes(status.toUpperCase())) {
        throw new BadRequestException(
          'Invalid status. Status must be either "ACTIVE", "DEAD", or "UNKNOWN".',
        );
      }
      where = { ...where, status };
    }
    if (location) {
      where = { ...where, location: { name: location } };
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

  async findOne(id: number) {
    return this.prisma.character.findUnique({
      where: { id },
      include: {
        location: true,
        episodes: true,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    const { locationId, episodeIds, ...data } = updateCharacterDto;
    return this.prisma.character.update({
      where: { id },
      data: {
        ...data,
        location: { connect: { id: locationId } },
        episodes: {
          disconnect: episodeIds.map((episodeId) => ({ id: episodeId })),
          connect: episodeIds.map((episodeId) => ({ id: episodeId })),
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.character.delete({
      where: { id },
    });
  }
}
