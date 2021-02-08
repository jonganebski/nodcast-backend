import { Resolver } from '@nestjs/graphql';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}
}
