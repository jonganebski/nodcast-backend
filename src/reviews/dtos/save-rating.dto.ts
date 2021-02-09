import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, Max, Min } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { RATING_MAX, RATING_MIN } from '../reviews.constants';

@InputType()
export class SaveRatingInput {
  @Field(() => Number)
  @IsNumber()
  podcastId: number;

  @Field(() => Number)
  @IsNumber()
  @Min(RATING_MIN)
  @Max(RATING_MAX)
  rating: number;
}

@ObjectType()
export class SaveRatingOutput extends CoreOutput {}
