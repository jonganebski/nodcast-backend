import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, MaxLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { REVIEW_TEXT_MAX_LENGTH } from '../reviews.constants';

@InputType()
export class EditReviewInput {
  @Field(() => Number)
  @IsNumber()
  reviewId: number;

  @Field(() => String)
  @IsString()
  @MaxLength(REVIEW_TEXT_MAX_LENGTH)
  text: string;
}

@ObjectType()
export class EditReviewOutput extends CoreOutput {}
