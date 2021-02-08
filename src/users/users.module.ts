import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from 'src/podcasts/entities/episode.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Users } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Podcast, Episode])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
