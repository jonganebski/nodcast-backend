import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Category } from '../entities/category.entity';
import { Podcast } from '../entities/podcast.entity';
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
  @IsOptional()
  @IsString()
  @MaxLength(PODCAST_DESC_MAX_LENGTH)
  description?: string;

  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;
}

@ObjectType()
export class CreatePodcastOutput extends CoreOutput {
  @Field(() => Podcast, { nullable: true })
  podcast?: Podcast;

  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
