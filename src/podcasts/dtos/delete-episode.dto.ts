import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';

@InputType()
export class DeleteEpisodeInput {
  @Field(() => Number)
  @IsNumber()
  episodeId: number;
}

@ObjectType()
export class DeleteEpisodeOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  id?: number;
}
