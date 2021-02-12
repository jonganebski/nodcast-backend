import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { Episode } from 'src/podcasts/entities/episode.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { GetFeedOutput } from './dtos/get-feed.dto';
import { GetSubscriptionsOutput } from './dtos/get-subscriptions.dto';
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
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async findById({ id }: { id: number }) {
    try {
      const user = await this.users.findOne(
        { id },
        { relations: ['subscriptions'] },
      );
      return { ok: true, user };
    } catch {
      return { ok: false };
    }
  }

  async createAccount({
    email,
    username,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const existUser = await this.users.findOne({ email });
      if (existUser) {
        return { ok: false, err: 'This email has an account' };
      }
      const user = this.users.create({ email, username, password, role });
      const { id } = await this.users.save(user);
      return { ok: true, id };
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
    { email, username, avatarUrl, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const existUser = await this.users.findOne({
        where: [{ email }, { username }],
      });
      if (existUser && existUser.id !== authUser.id) {
        if (existUser.email === email) {
          return { ok: false, err: 'This email is already taken' };
        } else if (existUser.username === username) {
          return { ok: false, err: 'This username is already taken' };
        }
      }
      if (avatarUrl !== authUser.avatarUrl) {
        if (authUser.avatarUrl) {
          this.awsS3Service.delete({ urls: [authUser.avatarUrl] });
        }
      }
      authUser.email = email;
      authUser.username = username;
      authUser.avatarUrl = avatarUrl;
      if (password) {
        authUser.password = password;
      }
      await this.users.save(authUser);
      return { ok: true, avatarUrl };
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

  async getSubscribtions(authUser: Users): Promise<GetSubscriptionsOutput> {
    try {
      const podcasts = authUser.subscriptions;
      return { ok: true, podcasts };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to get subscriptions' };
    }
  }

  async getFeed(authUser: Users): Promise<GetFeedOutput> {
    try {
      const oneWeekAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
      const episodes = await this.episodes
        .createQueryBuilder('episode')
        .where(`episode.createdAt >= :oneWeekAgo`, {
          oneWeekAgo: `${oneWeekAgo.getFullYear()}-${
            oneWeekAgo.getMonth() + 1
          }-${oneWeekAgo.getDate()}`,
        })
        .leftJoinAndSelect('episode.podcast', 'podcast')
        .leftJoinAndSelect('podcast.subscribers', 'subscriber')
        .andWhere('subscriber.id = :id', { id: authUser.id })
        .orderBy('episode.createdAt', 'DESC')
        .getMany();
      return { ok: true, episodes };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to get feeds' };
    }
  }
}
