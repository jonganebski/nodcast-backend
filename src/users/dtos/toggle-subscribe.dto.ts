import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';

@InputType()
export class ToggleSubscribeInput {
  @Field(() => Number)
  @IsNumber()
  podcastId: number;
}

@ObjectType()
export class ToggleSubscribeOutput extends CoreOutput {}
