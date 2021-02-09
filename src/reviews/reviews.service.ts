import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SaveRatingInput, SaveRatingOutput } from './dtos/save-rating.dto';
import {
  CreateReviewInput,
  CreateReviewOutput,
} from './dtos/create-review.dto';
import { EditReviewInput, EditReviewOutput } from './dtos/edit-review.dto';
import { GetReviewsInput, GetReviewsOutput } from './dtos/get-reviews.dto';
import { Rating } from './entities/rating.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
  ) {}

  async createReview(
    authUser: Users,
    { podcastId, text }: CreateReviewInput,
  ): Promise<CreateReviewOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id: podcastId });
      if (!podcast) {
        return { ok: false, err: 'Podcast not found' };
      }
      const review = this.reviews.create({ text });
      review.podcast = podcast;
      review.creator = authUser;
      const created = await this.reviews.save(review);
      return { ok: true, id: created.id };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to create review' };
    }
  }
  async editReview(
    authUser: Users,
    { reviewId, text }: EditReviewInput,
  ): Promise<EditReviewOutput> {
    try {
      const review = await this.reviews.findOne({ id: reviewId });
      if (review.creatorId !== authUser.id) {
        return { ok: false, err: 'Not authorized' };
      }
      await this.reviews.save({ ...review, text });
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to edit review' };
    }
  }

  async getReviews({
    page,
    podcastId,
  }: GetReviewsInput): Promise<GetReviewsOutput> {
    try {
      const reviews = await this.reviews.find({
        where: { podcastId },
        order: { createdAt: 'DESC' },
        relations: ['creator'],
        skip: (page - 1) * 50,
        take: 50,
      });
      return { ok: true, reviews };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to get reviews' };
    }
  }
}

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private readonly ratings: Repository<Rating>,
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
  ) {}

  async saveRating(
    authUser: Users,
    { podcastId, rating }: SaveRatingInput,
  ): Promise<SaveRatingOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id: podcastId });
      if (!podcast) {
        return { ok: false, err: 'Podcast not found' };
      }
      const existRating = await this.ratings.findOne({
        creatorId: authUser.id,
        podcastId: podcastId,
      });
      if (existRating) {
        await this.ratings.save({ ...existRating, rating });
        return { ok: true };
      } else {
        const ratingObj = this.ratings.create({ rating });
        ratingObj.creator = authUser;
        ratingObj.podcast = podcast;
        await this.ratings.save(ratingObj);
        return { ok: true };
      }
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to create rating' };
    }
  }
}
