import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreOutput } from './core-output.dto';

@InputType()
export class PaginatorInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  page: number;
}

@ObjectType()
export class PaginatorOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  currentPage?: number;

  @Field(() => Number, { nullable: true })
  totalPages?: number;
}
