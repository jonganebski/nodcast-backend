import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Episode } from 'src/podcasts/entities/episode.entity';

@ObjectType()
export class GetFeedOutput extends CoreOutput {
  @Field(() => [Episode], { nullable: true })
  episodes?: Episode[];
}
