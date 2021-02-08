import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PaginatorInput, PaginatorOutput } from 'src/common/dtos/paginator.dto';
import { Episode } from 'src/podcasts/entities/episode.entity';

@InputType()
export class GetFeedInput extends PaginatorInput {}

@ObjectType()
export class GetFeedOutput extends PaginatorOutput {
  @Field(() => [Episode], { nullable: true })
  episodes?: Episode[];
}
