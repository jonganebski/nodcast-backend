import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH } from '../users.constants';

@InputType()
export class EditProfileInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MaxLength(USERNAME_MAX_LENGTH)
  username: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  password?: string;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
