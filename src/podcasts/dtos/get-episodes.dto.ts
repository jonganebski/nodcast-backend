import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Episode } from '../entities/episode.entity';

@ObjectType()
export class GetEpisodesOutput extends CoreOutput {
  @Field(() => [Episode], { nullable: true })
  episodes?: Episode[];
}
