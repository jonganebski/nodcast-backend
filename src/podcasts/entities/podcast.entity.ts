import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, MaxLength } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Rating } from 'src/reviews/entities/rating.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import {
  PODCAST_DESC_MAX_LENGTH,
  PODCAST_TITLE_MAX_LENGTH,
} from '../podcasts.constants';
import { Category } from './category.entity';
import { Episode } from './episode.entity';

@InputType('PodcastInputType')
@ObjectType({ isAbstract: true })
@Entity()
export class Podcast extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  @MaxLength(PODCAST_TITLE_MAX_LENGTH)
  title: string;

  @Column({ default: '' })
  @Field(() => String, { defaultValue: '' })
  @IsString()
  @MaxLength(PODCAST_DESC_MAX_LENGTH)
  description: string;

  @Column({ default: 0 })
  @Field(() => Number, { defaultValue: 0 })
  @IsNumber()
  subscribersCount: number;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.podcasts, {
    onDelete: 'CASCADE',
  })
  creator: Users;

  @RelationId((podcast: Podcast) => podcast.creator)
  creatorId: number;

  @ManyToMany(() => Users, (user) => user.subsriptions)
  @Field(() => [Users])
  subscribers: Users[];

  @ManyToMany(() => Category, (category) => category.podcasts)
  @Field(() => [Category])
  categories: Category[];

  @OneToMany(() => Episode, (episode) => episode.podcast)
  @Field(() => [Episode])
  episodes: Episode[];

  @OneToMany(() => Review, (review) => review.podcast)
  @Field(() => [Review])
  reviews: Review[];

  @OneToMany(() => Rating, (rating) => rating.podcast)
  @Field(() => [Rating])
  ratings: Rating[];
}
