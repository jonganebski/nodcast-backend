import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import {
  CategoryResolver,
  EpisodesResolver,
  PodcastsResolver,
} from './podcasts.resolver';
import {
  CategoriesService,
  EpisodesService,
  PodcastsService,
} from './podcasts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Podcast, Episode])],
  providers: [
    CategoryResolver,
    CategoriesService,
    PodcastsResolver,
    PodcastsService,
    EpisodesResolver,
    EpisodesService,
  ],
})
export class PodcastsModule {}
