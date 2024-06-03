import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersModule } from './characters/characters.module';
import { PrismaModule } from './prisma/prisma.module';
import { EpisodesModule } from './episodes/episodes.module';
import { LocationsModule } from './locations/locations.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [CharactersModule, PrismaModule, EpisodesModule, LocationsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
