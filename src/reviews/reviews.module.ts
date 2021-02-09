import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Rating } from './entities/rating.entity';
import { Review } from './entities/review.entity';
import { RatingsResolver, ReviewsResolver } from './reviews.resolver';
import { RatingsService, ReviewsService } from './reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Rating, Podcast])],
  providers: [ReviewsResolver, ReviewsService, RatingsResolver, RatingsService],
})
export class ReviewsModule {}
