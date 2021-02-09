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
    @InjectRepository(Rating) private readonly ratings: Repository<Rating>,
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
      const [paginatedReviews, reviewsCount] = await this.reviews.findAndCount({
        where: { podcast: { id: podcastId } },
        order: { createdAt: 'DESC' },
        relations: ['creator'],
        skip: (page - 1) * 1,
        take: 1,
      });
      const promises = paginatedReviews.map(async (review) => {
        const ratings = await this.ratings.find({
          where: { creator: review.creator, podcast: { id: podcastId } },
        });
        review.creator.ratings = ratings;
        return review;
      });
      const reviews = await Promise.all(promises);
      return {
        ok: true,
        reviews,
        currentPage: page,
        totalPages: reviewsCount / 1,
      };
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
      let podcast = await this.podcasts.findOne({ id: podcastId });
      if (!podcast) {
        return { ok: false, err: 'Podcast not found' };
      }
      const existRating = await this.ratings.findOne({
        creatorId: authUser.id,
        podcastId: podcastId,
      });
      if (existRating) {
        existRating.rating = rating;
        await this.ratings.save(existRating);
      } else {
        const ratingObj = this.ratings.create({ rating });
        ratingObj.creator = authUser;
        ratingObj.podcast = podcast;
        await this.ratings.save(ratingObj);
      }
      podcast = await this.podcasts.findOne(
        { id: podcastId },
        { relations: ['ratings'] },
      );
      podcast.rating =
        podcast.ratings.reduce((acc, value) => {
          return acc + value.rating;
        }, 0) / podcast.ratings.length;
      await this.podcasts.save(podcast);
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to create rating' };
    }
  }
}
