import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsArray, IsString, MaxLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import {
  PODCAST_DESC_MAX_LENGTH,
  PODCAST_TITLE_MAX_LENGTH,
} from '../podcasts.constants';

@InputType()
export class CreatePodcastInput {
  @Field(() => String)
  @IsString()
  @MaxLength(PODCAST_TITLE_MAX_LENGTH)
  title: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(PODCAST_DESC_MAX_LENGTH)
  description?: string;

  @Field(() => [Number], { nullable: true })
  @IsArray()
  categoryIds?: number[];
}

@ObjectType()
export class CreatePodcastOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  id?: number;
}
