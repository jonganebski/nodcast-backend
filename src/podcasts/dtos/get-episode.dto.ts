import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Episode } from '../entities/episode.entity';

@InputType()
export class GetEpisodeInput {
  @Field(() => Number)
  @IsNumber()
  episodeId: number;
}

@ObjectType()
export class GetEpisodeOutput extends CoreOutput {
  @Field(() => Episode, { nullable: true })
  episode?: Episode;
}
