import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
