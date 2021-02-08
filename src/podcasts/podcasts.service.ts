import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole, Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/delete-episode.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dtos/delete-podcast.dto';
import { EditEpisodeInput, EditEpisodeOutput } from './dtos/edit-episode.dto';
import { EditPodcastInput, EditPodcastOutput } from './dtos/edit-podcast.dto';
import { GetCategoriesOutput } from './dtos/get-categories.dto';
import { GetCategoryInput, GetCategoryOutput } from './dtos/get-category.dto';
import { GetPodcastInput, GetPodcastOutput } from './dtos/get-podcast.dto';
import { Category } from './entities/category.entity';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Podcast)
    private readonly podcasts: Repository<Podcast>,
  ) {}

  async createCategory({
    name,
  }: CreateCategoryInput): Promise<CreateCategoryOutput> {
    try {
      const category = await this.categories.create({ name });
      await this.categories.save(category);
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to create category' };
    }
  }

  async getCategories(authUser: Users): Promise<GetCategoriesOutput> {
    try {
      let categories = await this.categories.find();
      if (authUser.role === UserRole.Host) {
        return { ok: true, categories };
      } else {
        const promises = categories.map(async (category) => {
          category.podcasts = await this.podcasts
            .createQueryBuilder('podcast')
            .leftJoin('podcast.categories', 'category')
            .where('category.id = :id', { id: category.id })
            .orderBy({ 'podcast.subscribersCount': 'DESC' })
            .take(10)
            .getMany();
          return category;
        });
        categories = await Promise.all(promises);

        return { ok: true, categories };
      }
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to get categories' };
    }
  }

  async getCategory({
    categoryId,
  }: GetCategoryInput): Promise<GetCategoryOutput> {
    try {
      const category = await this.categories.findOne({ id: categoryId });
      if (!category) {
        return { ok: false, err: 'Category not found' };
      }
      const podcasts = await this.podcasts
        .createQueryBuilder('podcast')
        .leftJoin('podcast.categories', 'category')
        .where('category.id = :id', { id: category.id })
        .orderBy({ 'podcast.subscribersCount': 'DESC' })
        .take(40)
        .getMany();
      return { ok: true, podcasts };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to get category' };
    }
  }
}

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Podcast)
    private readonly podcasts: Repository<Podcast>,
  ) {}

  async createPodcast(
    authUser: Users,
    { title, description, categoryIds }: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    try {
      const categories = await this.categories.find({
        where: [...categoryIds.map((id) => ({ id }))],
      });
      const podcast = await this.podcasts.create({
        title,
        description,
      });
      podcast.creator = authUser;
      podcast.categories = categories;
      const created = await this.podcasts.save(podcast);
      return { ok: true, id: created.id };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to create podcast' };
    }
  }

  async editPodcast(
    authUser: Users,
    { podcastId, categoryIds, ...payload }: EditPodcastInput,
  ): Promise<EditPodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id: podcastId });
      if (podcast.creator.id !== authUser.id) {
        return { ok: false, err: 'Not authorized' };
      }
      const categories = await this.categories.find({
        where: [...categoryIds],
      });
      await this.podcasts.save({ ...podcast, ...payload, categories });
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to edit podcast' };
    }
  }

  async deletePodcast(
    authUser: Users,
    { podcastId }: DeletePodcastInput,
  ): Promise<DeletePodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id: podcastId });
      if (podcast.creator.id !== authUser.id) {
        return { ok: false, err: 'Not authorized' };
      }
      const delResult = await this.podcasts.delete({ id: podcastId });
      if (delResult.affected === 0) {
        return { ok: false, err: 'Failed to delete podcast' };
      }
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to delete podcast' };
    }
  }

  async getPodcast(
    authUser: Users,
    { podcastId, page }: GetPodcastInput,
  ): Promise<GetPodcastOutput> {
    try {
      const podcast = await this.podcasts
        .createQueryBuilder('podcast')
        .where('podcast.id = :id', { id: podcastId })
        .leftJoinAndSelect('podcast.episodes', 'episode')
        .leftJoinAndSelect('podcast.creator', 'creator')
        .orderBy({ 'episode.createdAt': 'DESC' })
        .skip((page - 1) * 25)
        .take(25)
        .getOne();
      if (authUser.role === UserRole.Host) {
        if (podcast.creator.id !== authUser.id) {
          return { ok: false, err: 'Not authorized' };
        }
      } else {
        return { ok: true, podcast };
      }
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to get podcast' };
    }
  }
}

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
  ) {}

  async createEpisode(
    authUser: Users,
    { podcastId, ...payload }: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id: podcastId });
      if (!podcast) {
        return { ok: false, err: 'Podcast not found' };
      }
      if (podcast.creator.id !== authUser.id) {
        return { ok: false, err: 'Not authorized' };
      }
      const episode = this.episodes.create({ ...payload });
      episode.podcast = podcast;
      const created = await this.episodes.save(episode);
      return { ok: true, id: created.id };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to create episode' };
    }
  }

  async editEpisode(
    authUser: Users,
    { episodeId, ...payload }: EditEpisodeInput,
  ): Promise<EditEpisodeOutput> {
    try {
      const episode = await this.episodes.findOne(
        { id: episodeId },
        { relations: ['podcast.creator'] },
      );
      if (episode.podcast.creator.id !== authUser.id) {
        return { ok: false, err: 'Not authorized' };
      }
      await this.episodes.save({ ...episode, ...payload });
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to edit episode' };
    }
  }

  async deleteEpisode(
    authUser: Users,
    { episodeId }: DeleteEpisodeInput,
  ): Promise<DeleteEpisodeOutput> {
    try {
      const episode = await this.episodes.findOne(
        { id: episodeId },
        { relations: ['podcast.creator'] },
      );
      if (!episode) {
        return { ok: false, err: 'Episode not found' };
      }
      if (episode.podcast.creator.id !== authUser.id) {
        return { ok: false, err: 'Not authorized' };
      }
      const delResult = await this.episodes.delete({ id: episodeId });
      if (delResult.affected === 0) {
        return { ok: false, err: 'Failed to delete episode' };
      }
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to delete episode' };
    }
  }
}
