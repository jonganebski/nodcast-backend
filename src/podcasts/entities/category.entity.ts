import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Podcast } from './podcast.entity';

@InputType('CategoryInputType')
@ObjectType({ isAbstract: true })
@Entity()
export class Category extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  name: string;

  @ManyToMany(() => Podcast, (podcast) => podcast.categories)
  @JoinTable()
  @Field(() => [Podcast])
  podcasts: Podcast[];
}
