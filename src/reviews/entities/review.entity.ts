import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsDecimal,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Users } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('ReviewInputType')
@ObjectType({ isAbstract: true })
@Entity()
export class Review extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  @MaxLength(500)
  text: string;

  @Column()
  @Field(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

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
