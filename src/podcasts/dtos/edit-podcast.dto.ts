import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
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
import { PODCAST_DESC_MAX_LENGTH } from '../podcasts.constants';

@InputType()
export class EditPodcastInput extends PickType(Podcast, ['title']) {
  @Field(() => Number)
  @IsNumber()
  podcastId: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(PODCAST_DESC_MAX_LENGTH)
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @Field(() => [Number])
  @IsArray()
  categoryIds?: number[];
}

@ObjectType()
export class EditPodcastOutput extends CoreOutput {
  @Field(() => Podcast, { nullable: true })
  editedPodcast?: Podcast;

  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
