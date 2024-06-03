// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.comment.deleteMany({});
  await prisma.episode.deleteMany({});
  await prisma.character.deleteMany({});
  await prisma.location.deleteMany({});

  // Create locations
  const location1 = await prisma.location.create({
    data: {
      name: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      createdAt: new Date(),
    },
  });

  const location2 = await prisma.location.create({
    data: {
      name: 'Los Angeles',
      latitude: 34.0522,
      longitude: -118.2437,
      createdAt: new Date(),
    },
  });

  // Create characters
  const character1 = await prisma.character.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      status: 'ACTIVE',
      stateOfOrigin: 'California',
      gender: 'MALE',
      locationId: location1.id,
      createdAt: new Date(),
    },
  });

  const character2 = await prisma.character.create({
    data: {
      firstName: 'Jane',
      lastName: 'Doe',
      status: 'DEAD',
      stateOfOrigin: 'New York',
      gender: 'FEMALE',
      locationId: location2.id,
      createdAt: new Date(),
    },
  });

  // Create episodes
  const episode1 = await prisma.episode.create({
    data: {
      name: 'Episode 1',
      releaseDate: new Date('2023-12-01T00:00:00.000Z'),
      episodeCode: 'S01E01',
      createdAt: new Date(),
      characters: {
        connect: [{ id: character1.id }, { id: character2.id }],
      },
      comments: {
        create: [
          {
            comment: 'Great episode!',
            ipAddressLocation: '192.168.0.1',
            createdAt: new Date(),
          },
          {
            comment: 'Loved the ending.',
            ipAddressLocation: '192.168.0.2',
            createdAt: new Date(),
          },
        ],
      },
    },
  });

  console.log({ location1, location2, character1, character2, episode1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
