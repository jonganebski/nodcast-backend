import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { Users } from '../entities/user.entity';
import { PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH } from '../users.constants';

@InputType()
export class CreateAccountInput extends PickType(Users, ['role']) {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MaxLength(USERNAME_MAX_LENGTH)
  username: string;

  @Field(() => String)
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  password: string;
}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
