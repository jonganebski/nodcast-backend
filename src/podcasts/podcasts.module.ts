import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { Rating } from 'src/reviews/entities/rating.entity';
import { Users } from 'src/users/entities/user.entity';
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
  imports: [TypeOrmModule.forFeature([Category, Podcast, Episode, Rating])],
  providers: [
    CategoryResolver,
    CategoriesService,
    PodcastsResolver,
    PodcastsService,
    EpisodesResolver,
    EpisodesService,
    AwsS3Service,
  ],
})
export class PodcastsModule {}
