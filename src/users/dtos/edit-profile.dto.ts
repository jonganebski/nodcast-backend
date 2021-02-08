import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';

@InputType()
export class EditProfileInput {
  @Field(() => String)
  @IsEmail()
  email: string;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
