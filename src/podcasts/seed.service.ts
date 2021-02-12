import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';

export interface ISeedPodcastInput {
  creatorId: number;
  categories: Category[];
  coverUrl: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISeedPodcastOutput {
  err?: string;
  id?: number;
}

@Injectable()
export class SeedPodcastsService {
  constructor(
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Users) private readonly users: Repository<Users>,
  ) {}

  async seedPodcast({
    creatorId,
    ...payload
  }: ISeedPodcastInput): Promise<ISeedPodcastOutput> {
    try {
      const creator = await this.users.findOne({ id: creatorId });
      const podcast = this.podcasts.create({ ...payload });
      podcast.creator = creator;
      const { id } = await this.podcasts.save(podcast);
      return { id };
    } catch (err) {
      return { err };
    }
  }
}

export interface ISeedEpisodeInput {
  podcastId: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  audioUrl: string;
  dutationSeconds: number;
}

export interface ISeedEpisodeOutput {
  err?: string;
}

@Injectable()
export class SeedEpisodesService {
  constructor(
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
  ) {}

  async seedEpisode({
    podcastId,
    ...payload
  }: ISeedEpisodeInput): Promise<ISeedEpisodeOutput> {
    try {
      const podcast = await this.podcasts.findOne(
        { id: podcastId },
        { relations: ['creator'] },
      );
      const episode = this.episodes.create({ ...payload });
      episode.podcast = podcast;
      episode.creator = podcast.creator;
      await this.episodes.save(episode);
      return { err: null };
    } catch (err) {
      return { err };
    }
  }
}
