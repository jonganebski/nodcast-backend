import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Users } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(Users, ['role']) {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string;
}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
