import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, IsUrl, MaxLength } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import {
  EPISODE_DESC_MAX_LENGTH,
  EPISODE_TITLE_MAX_LENGTH,
} from '../podcasts.constants';
import { Podcast } from './podcast.entity';

@InputType('EpisodeInputType')
@ObjectType({ isAbstract: true })
@Entity()
export class Episode extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  @MaxLength(EPISODE_TITLE_MAX_LENGTH)
  title: string;

  @Column({ default: '' })
  @Field(() => String, { defaultValue: '' })
  @IsString()
  @MaxLength(EPISODE_DESC_MAX_LENGTH)
  description: string;

  @Column()
  @Field(() => String)
  @IsUrl()
  audioUrl: string;

  @Column()
  @Field(() => Number)
  @IsNumber()
  dutationSeconds: number;

  @ManyToOne(() => Users, (user) => user.episodes, { onDelete: 'CASCADE' })
  @Field(() => Users)
  creator: Users;

  @RelationId((episode: Episode) => episode.creator)
  creatorId: number;

  @ManyToOne(() => Podcast, (podcast) => podcast.episodes, {
    onDelete: 'CASCADE',
  })
  @Field(() => Podcast)
  podcast: Podcast;

  @RelationId((episode: Episode) => episode.podcast)
  podcastId: number;

  @ManyToMany(() => Users)
  @JoinTable()
  @Field(() => [Users])
  playedUsers: Users[];
}
