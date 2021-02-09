import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Users } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { REVIEW_TEXT_MAX_LENGTH } from '../reviews.constants';

@InputType('ReviewInputType')
@ObjectType({ isAbstract: true })
@Entity()
export class Review extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  @MaxLength(REVIEW_TEXT_MAX_LENGTH)
  text: string;

  @ManyToOne(() => Users, (user) => user.reviews, { onDelete: 'CASCADE' })
  @Field(() => Users)
  creator: Users;

  @RelationId((review: Review) => review.creator)
  creatorId: number;

  @ManyToOne(() => Podcast, (podcast) => podcast.reviews, {
    onDelete: 'CASCADE',
  })
  @Field(() => Podcast)
  podcast: Podcast;

  @RelationId((review: Review) => review.podcast)
  podcastId: number;
}
