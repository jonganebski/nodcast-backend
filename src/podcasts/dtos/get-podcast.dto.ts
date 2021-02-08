import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { PaginatorInput, PaginatorOutput } from 'src/common/dtos/paginator.dto';
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
}
