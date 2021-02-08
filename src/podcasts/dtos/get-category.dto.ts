import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class GetCategoryInput {
  @Field(() => Number)
  categoryId: number;
}

@ObjectType()
export class GetCategoryOutput extends CoreOutput {
  @Field(() => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}
