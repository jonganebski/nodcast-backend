import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Review } from 'src/reviews/entities/review.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  Host = 'Host',
  Listener = 'Listener',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType')
@ObjectType({ isAbstract: true })
@Entity()
export class Users extends CoreEntity {
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (err) {
        throw new InternalServerErrorException();
      }
    }
  }

  async verifyPassword(inputPassword): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(inputPassword, this.password);
      return isMatch;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @Column()
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column()
  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  role: UserRole;

  @OneToMany(() => Podcast, (p) => p.creator)
  @Field(() => [Podcast])
  podcasts: Podcast[];

  @ManyToMany(() => Podcast, (podcast) => podcast.subscribers)
  @Field(() => [Podcast])
  @JoinTable()
  subsriptions: Podcast[];

  @OneToMany(() => Review, (r) => r.creator)
  @Field(() => [Review])
  reviews: Review[];
}
