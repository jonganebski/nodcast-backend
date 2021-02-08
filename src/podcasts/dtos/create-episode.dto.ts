import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, MaxLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import {
  EPISODE_DESC_MAX_LENGTH,
  EPISODE_TITLE_MAX_LENGTH,
} from '../podcasts.constants';

@InputType()
export class CreateEpisodeInput {
  @Field(() => Number)
  @IsNumber()
  podcastId: number;

  @Field(() => String)
  @IsString()
  @MaxLength(EPISODE_TITLE_MAX_LENGTH)
  title: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(EPISODE_DESC_MAX_LENGTH)
  description?: string;
}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  id?: number;
}
