import { Injectable } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_createCharacterDto: CreateCharacterDto) {
    return this.prisma.character.create({
      data: _createCharacterDto,
    });
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
    return `This action returns a #${id} character`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateCharacterDto: UpdateCharacterDto) {
    return `This action updates a #${id} character`;
  }

  remove(id: number) {
    return `This action removes a #${id} character`;
  }
}
