import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, Max, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { RATING_MAX, RATING_MIN } from '../reviews.constants';

@InputType('RatingInputType')
@ObjectType({ isAbstract: true })
@Entity()
export class Rating extends CoreEntity {
  @Column({ type: 'float4' })
  @Field(() => Number)
  @IsNumber()
  @Min(RATING_MIN)
  @Max(RATING_MAX)
  rating: number;

  @ManyToOne(() => Users, (user) => user.ratings, { onDelete: 'CASCADE' })
  @Field(() => Users)
  creator: Users;

  @PrimaryColumn()
  @RelationId((rating: Rating) => rating.creator)
  creatorId: number;

  @ManyToOne(() => Podcast, (podcast) => podcast.ratings, {
    onDelete: 'CASCADE',
  })
  @Field(() => Podcast)
  podcast: Podcast;

  @PrimaryColumn()
  @RelationId((rating: Rating) => rating.podcast)
  podcastId: number;
}
