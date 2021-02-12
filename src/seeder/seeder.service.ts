import { Injectable } from '@nestjs/common';
import * as faker from 'faker';
import { CreateCategoryInput } from 'src/podcasts/dtos/create-category.dto';
import { CategoriesService } from 'src/podcasts/podcasts.service';
import {
  ISeedEpisodeInput,
  ISeedPodcastInput,
  SeedEpisodesService,
  SeedPodcastsService,
} from 'src/podcasts/seed.service';
import { CreateReviewInput } from 'src/reviews/dtos/create-review.dto';
import { SaveRatingInput } from 'src/reviews/dtos/save-rating.dto';
import { RatingsService, ReviewsService } from 'src/reviews/reviews.service';
import { CreateAccountInput } from 'src/users/dtos/create-account.dto';
import { UserRole } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import {
  CATEGORIES,
  SEED_EPISODES,
  SEED_PODCASTS,
  SEED_USERS,
} from './seeder.constants';

@Injectable()
export class SeederService {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
    private readonly seedPodcastsService: SeedPodcastsService,
    private readonly seedEpisodesService: SeedEpisodesService,
    private readonly reviewsService: ReviewsService,
    private readonly ratingsService: RatingsService,
  ) {}

  private COVER_URL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/images/public/covers`;
  private AUDIO_URL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/audios/public`;

  async seed() {
    const categories = await this.categoriesService.getAllCategories();
    if (categories.length !== 0) {
      console.log('🌳 Categories already exists. Abort seed.');
      return;
    }

    console.log('🌱 Seeding categories...');
    for (let i = 0; i < CATEGORIES.length; i++) {
      const createCategoryInput: CreateCategoryInput = {
        name: CATEGORIES[i],
      };
      const { ok, err } = await this.categoriesService.createCategory(
        createCategoryInput,
      );
      if (!ok) {
        console.log(err);
        break;
      }
    }

    console.log('🌱 Seeding hosts...');
    const fakeHostIds: number[] = [];
    for (let i = 0; i < SEED_USERS.TOTAL_HOSTS; i++) {
      const createHostInput: CreateAccountInput = {
        email: `admin@host${i + 1}.com`,
        username: faker.internet.userName(),
        role: UserRole.Host,
        password: process.env.SEED_USER_PASSWORD,
      };
      const { ok, err, id } = await this.usersService.createAccount(
        createHostInput,
      );
      if (!ok) {
        console.log(err);
        break;
      }
      fakeHostIds.push(id);
    }

    console.log('🌱 Seeding podcasts...');
    const fakePodcastIds = [];
    for (let i = 0; i < fakeHostIds.length; i++) {
      const categories = await this.categoriesService.getAllCategories();
      if (categories) {
        const seedPodcastInput: ISeedPodcastInput = {
          creatorId: fakeHostIds[i],
          title: faker.random.words(Math.floor(Math.random() * 2 + 1)),
          description: faker.lorem.sentences(Math.floor(Math.random() * 5)),
          createdAt: faker.date.past(1),
          updatedAt: faker.date.recent(Math.floor(Math.random() * 7) + 1),
          categories: [
            categories[Math.floor(Math.random() * categories.length)],
          ],
          coverUrl:
            this.COVER_URL +
            `/dummy-cover-${
              Math.floor(Math.random() * SEED_PODCASTS.TOTAL_COVER) + 1
            }.jpg`,
        };
        const { id, err } = await this.seedPodcastsService.seedPodcast(
          seedPodcastInput,
        );
        if (err) {
          console.log(err);
          break;
        }
        fakePodcastIds.push(id);
      }
    }

    console.log('🌱 Seeding episodes...');
    for (let i = 0; i < fakePodcastIds.length; i++) {
      for (
        let j = 0;
        j < Math.floor(Math.random() * SEED_EPISODES.MAX + 1);
        j++
      ) {
        const fileNum = Math.floor(Math.random() * 3) + 1;
        const date = faker.date.recent(Math.floor(Math.random() * 28));
        const seedEpisodeInput: ISeedEpisodeInput = {
          podcastId: fakePodcastIds[i],
          audioUrl: this.AUDIO_URL + `/nomad-dummy-${fileNum}.mp3`,
          title: faker.name.title(),
          description: faker.lorem.sentences(Math.floor(Math.random() * 5)),
          dutationSeconds: fileNum === 1 ? 274 : fileNum === 2 ? 457 : 326,
          createdAt: date,
          updatedAt: date,
        };
        const { err } = await this.seedEpisodesService.seedEpisode(
          seedEpisodeInput,
        );
        if (err) {
          console.log(err);
          break;
        }
      }
    }

    console.log('🌱 Seeding listeners...');
    const fakeListenerIds = [];
    for (let i = 0; i < SEED_USERS.TOTAL_LISTENERS; i++) {
      const createAccountInput: CreateAccountInput = {
        email: `admin@listener${i + 1}.com`,
        username: faker.internet.userName(),
        role: UserRole.Listener,
        password: process.env.SEED_USER_PASSWORD,
      };
      const { ok, err, id } = await this.usersService.createAccount(
        createAccountInput,
      );
      if (!ok) {
        console.log(err);
        break;
      }
      fakeListenerIds.push(id);
    }

    console.log('🌱 Seeding reviews...');
    for (let i = 0; i < fakeListenerIds.length; i++) {
      const { ok, user } = await this.usersService.findById({
        id: fakeListenerIds[i],
      });
      if (!ok) {
        console.log('Failed to find listener');
        break;
      }
      const targetPodcastIds: number[] = [];
      fakePodcastIds.forEach((id) => {
        Math.floor(Math.random() * 10 + 1) % 3 === 0 &&
          targetPodcastIds.push(id);
      });
      for (let j = 0; j < targetPodcastIds.length; j++) {
        const createReviewInput: CreateReviewInput = {
          podcastId: targetPodcastIds[j],
          text: faker.lorem.sentences(Math.floor(Math.random() * 10 + 1)),
        };
        const { ok, err } = await this.reviewsService.createReview(
          user,
          createReviewInput,
        );
        if (!ok) {
          console.log(err);
          break;
        }
      }
    }

    console.log('🌱 Seeding ratings...');
    for (let i = 0; i < fakeListenerIds.length; i++) {
      const { ok, user } = await this.usersService.findById({
        id: fakeListenerIds[i],
      });
      if (!ok) {
        console.log('Listener not found');
        break;
      }
      for (let j = 0; j < fakePodcastIds.length; j++) {
        const saveRatingInput: SaveRatingInput = {
          podcastId: fakePodcastIds[j],
          rating: Math.floor(Math.random() * 5 + 1),
        };
        const { ok, err } = await this.ratingsService.saveRating(
          user,
          saveRatingInput,
        );
        if (!ok) {
          console.log(err);
          break;
        }
      }
    }

    console.log('🌱 Seeding completed!');
  }
}
