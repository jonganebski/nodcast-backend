import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field(() => String, { nullable: true })
  err?: string;

  @Field(() => Boolean)
  ok: boolean;
}
