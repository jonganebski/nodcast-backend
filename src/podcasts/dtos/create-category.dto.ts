import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core-output.dto';

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  name: string;
}

@ObjectType()
export class CreateCategoryOutput extends CoreOutput {}
