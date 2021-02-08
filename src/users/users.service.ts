import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { Episode } from 'src/podcasts/entities/episode.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { MoreThan, Raw, Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { GetFeedInput, GetFeedOutput } from './dtos/get-feed.dto';
import {
  GetSubscriptionsInput,
  GetSubscriptionsOutput,
} from './dtos/get-subscriptions.dto';
import { LoginInput, LoginOutput } from './dtos/log-in.dto';
import {
  ToggleSubscribeInput,
  ToggleSubscribeOutput,
} from './dtos/toggle-subscribe.dto';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly users: Repository<Users>,
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
    private readonly jwtService: JwtService,
  ) {}

  async findById(id: number) {
    try {
      const user = await this.users.findOne({ id });
      return { ok: true, user };
    } catch {
      return { ok: false };
    }
  }

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const existUser = await this.users.findOne({ email });
      if (existUser) {
        return { ok: false, err: 'This email has an account' };
      }
      const user = this.users.create({ email, password, role });
      await this.users.save(user);
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to create account' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        return { ok: false, err: 'Email or password is wrong' };
      }
      const passwordCorrect = await user.verifyPassword(password);
      if (!passwordCorrect) {
        return { ok: false, err: 'Email or password is wrong' };
      }
      const token = this.jwtService.sign(user.id);
      return { ok: true, token };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to log in' };
    }
  }

  async editProfile(
    authUser: Users,
    { email }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const existUser = await this.users.findOne({ email });
      if (existUser) {
        return { ok: false, err: 'This email is already taken' };
      }
      await this.users.save({ ...authUser, email });
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to edit profile' };
    }
  }

  async deleteAccount(authUser: Users): Promise<CoreOutput> {
    try {
      const delResult = await this.users.delete({ id: authUser.id });
      if (delResult.affected === 0) {
        return { ok: false, err: 'Failed to delete account' };
      }
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to delete account' };
    }
  }

  async toggleSubscribe(
    authUser: Users,
    { podcastId }: ToggleSubscribeInput,
  ): Promise<ToggleSubscribeOutput> {
    try {
      const podcast = await this.podcasts.findOne(
        {
          id: podcastId,
        },
        { relations: ['subscribers'] },
      );
      if (!podcast) {
        return { ok: false, err: 'Podcast not found' };
      }
      if (podcast.subscribers.some((user) => user.id === authUser.id)) {
        podcast.subscribers = podcast.subscribers.filter(
          (user) => user.id !== authUser.id,
        );
      } else {
        podcast.subscribers = [...podcast.subscribers, authUser];
      }

      podcast.subscribersCount = podcast.subscribers.length;
      await this.podcasts.save(podcast);
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to toggle subscribe' };
    }
  }

  async getSubscribtions(
    authUser: Users,
    { page }: GetSubscriptionsInput,
  ): Promise<GetSubscriptionsOutput> {
    try {
      const podcasts = await this.podcasts
        .createQueryBuilder('podcast')
        .where('podcast.creator.id = :id', { id: authUser.id })
        .leftJoinAndSelect('podcast.episodes', 'episode')
        .orderBy({ 'episode.updatedAt': 'DESC' })
        .skip((page - 1) * 20)
        .take(20)
        .getMany();
      return { ok: true, podcasts };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to get subscriptions' };
    }
  }

  async getFeed(
    authUser: Users,
    { page }: GetFeedInput,
  ): Promise<GetFeedOutput> {
    try {
      const oneWeekAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
      const episodes = await this.episodes.find({
        where: {
          podcast: { creator: authUser },
          updatedAt: MoreThan(
            `${oneWeekAgo.getFullYear()}-${
              oneWeekAgo.getMonth() + 1
            }-${oneWeekAgo.getDate()}`,
          ),
        },
        skip: (page - 1) * 20,
        take: 20,
      });
      return { ok: true, episodes };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to get feeds' };
    }
  }
}