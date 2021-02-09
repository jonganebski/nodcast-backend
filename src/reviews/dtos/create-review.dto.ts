import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, MaxLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { REVIEW_TEXT_MAX_LENGTH } from '../reviews.constants';

@InputType()
export class CreateReviewInput {
  @Field(() => Number)
  @IsNumber()
  podcastId: number;

  @Field(() => String)
  @IsString()
  @MaxLength(REVIEW_TEXT_MAX_LENGTH)
  text: string;
}

@ObjectType()
export class CreateReviewOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  id?: number;
}
