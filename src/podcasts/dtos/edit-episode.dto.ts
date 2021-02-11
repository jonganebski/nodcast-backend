import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, IsUrl, MaxLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Episode } from '../entities/episode.entity';
import {
  EPISODE_DESC_MAX_LENGTH,
  EPISODE_TITLE_MAX_LENGTH,
} from '../podcasts.constants';

@InputType()
export class EditEpisodeInput {
  @Field(() => Number)
  @IsNumber()
  episodeId: number;

  @Field(() => String)
  @IsString()
  @MaxLength(EPISODE_TITLE_MAX_LENGTH)
  title: string;

  @Field(() => String)
  @IsUrl()
  audioUrl: string;

  @Field(() => Number)
  @IsNumber()
  dutationSeconds: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(EPISODE_DESC_MAX_LENGTH)
  description?: string;
}

@ObjectType()
export class EditEpisodeOutput extends CoreOutput {
  @Field(() => Episode, { nullable: true })
  episode?: Episode;
}
