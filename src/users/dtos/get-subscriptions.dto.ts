import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PaginatorInput, PaginatorOutput } from 'src/common/dtos/paginator.dto';
import { Podcast } from 'src/podcasts/entities/podcast.entity';

@InputType()
export class GetSubscriptionsInput extends PaginatorInput {}

@ObjectType()
export class GetSubscriptionsOutput extends PaginatorOutput {
  @Field(() => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}
