import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PaginatorInput, PaginatorOutput } from 'src/common/dtos/paginator.dto';
import { Rating } from 'src/reviews/entities/rating.entity';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class GetPodcastInput extends PaginatorInput {
  @Field(() => Number)
  podcastId: number;
}

@ObjectType()
export class GetPodcastOutput extends PaginatorOutput {
  @Field(() => Podcast, { nullable: true })
  podcast?: Podcast;

  @Field(() => Rating, { nullable: true })
  myRating?: Rating;
}
