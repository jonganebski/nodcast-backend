import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsArray, IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class EditPodcastInput extends PickType(Podcast, [
  'title',
  'description',
]) {
  @Field(() => Number)
  @IsNumber()
  podcastId: number;

  @Field(() => [Number])
  @IsArray()
  categoryIds?: number[];
}

@ObjectType()
export class EditPodcastOutput extends CoreOutput {}
