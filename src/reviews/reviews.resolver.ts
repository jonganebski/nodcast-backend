import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { Users } from 'src/users/entities/user.entity';
import { SaveRatingInput, SaveRatingOutput } from './dtos/save-rating.dto';
import {
  CreateReviewInput,
  CreateReviewOutput,
} from './dtos/create-review.dto';
import { EditReviewInput, EditReviewOutput } from './dtos/edit-review.dto';
import { GetReviewsInput, GetReviewsOutput } from './dtos/get-reviews.dto';
import { Rating } from './entities/rating.entity';
import { Review } from './entities/review.entity';
import { RatingsService, ReviewsService } from './reviews.service';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Role(['Listener'])
  @Mutation(() => CreateReviewOutput)
  createReview(
    @AuthUser() authUser: Users,
    @Args('input') createReviewInput: CreateReviewInput,
  ): Promise<CreateReviewOutput> {
    return this.reviewsService.createReview(authUser, createReviewInput);
  }

  @Role(['Listener'])
  @Mutation(() => EditReviewOutput)
  editReview(
    @AuthUser() authUser: Users,
    @Args('input') editReviewInput: EditReviewInput,
  ): Promise<EditReviewOutput> {
    return this.reviewsService.editReview(authUser, editReviewInput);
  }

  @Role(['Any'])
  @Query(() => GetReviewsOutput)
  getReviews(
    @Args('input') getReviewsInput: GetReviewsInput,
  ): Promise<GetReviewsOutput> {
    return this.reviewsService.getReviews(getReviewsInput);
  }
}

@Resolver(() => Rating)
export class RatingsResolver {
  constructor(private readonly ratingsService: RatingsService) {}

  @Role(['Listener'])
  @Mutation(() => SaveRatingOutput)
  saveRating(
    @AuthUser() authUser: Users,
    @Args('input') createRatingInput: SaveRatingInput,
  ): Promise<SaveRatingOutput> {
    return this.ratingsService.saveRating(authUser, createRatingInput);
  }
}
