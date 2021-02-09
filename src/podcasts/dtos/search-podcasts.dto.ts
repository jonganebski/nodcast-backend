import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { PaginatorInput, PaginatorOutput } from 'src/common/dtos/paginator.dto';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class SearchPodcastsInput extends PaginatorInput {
  @Field(() => String)
  @IsString()
  titleQuery: string;
}

@ObjectType()
export class SearchPodcastsOutput extends PaginatorOutput {
  @Field(() => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}
