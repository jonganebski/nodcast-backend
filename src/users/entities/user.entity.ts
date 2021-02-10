import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { Rating } from 'src/reviews/entities/rating.entity';
import { Review } from 'src/reviews/entities/review.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH } from '../users.constants';

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

  @Column({ unique: true })
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(() => String)
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  password: string;

  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  @MaxLength(USERNAME_MAX_LENGTH)
  username: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  role: UserRole;

  @OneToOne(() => Podcast, (podcast) => podcast.creator, { nullable: true })
  @Field(() => Podcast, { nullable: true })
  podcast: Podcast;

  @ManyToMany(() => Podcast, (podcast) => podcast.subscribers)
  @Field(() => [Podcast])
  @JoinTable()
  subscriptions: Podcast[];

  @OneToMany(() => Review, (review) => review.creator)
  @Field(() => [Review])
  reviews: Review[];

  @OneToMany(() => Rating, (rating) => rating.creator)
  @Field(() => [Rating])
  ratings: Rating[];
}
