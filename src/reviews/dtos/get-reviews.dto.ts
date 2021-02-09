import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PaginatorInput, PaginatorOutput } from 'src/common/dtos/paginator.dto';
import { Review } from '../entities/review.entity';

@InputType()
export class GetReviewsInput extends PaginatorInput {
  @Field(() => Number)
  podcastId: number;
}

@ObjectType()
export class GetReviewsOutput extends PaginatorOutput {
  @Field(() => [Review], { nullable: true })
  reviews?: Review[];
}
