import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginatorInput, PaginatorOutput } from 'src/common/dtos/paginator.dto';
import { Rating } from 'src/reviews/entities/rating.entity';
import { Category } from '../entities/category.entity';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class GetPodcastInput extends PaginatorInput {
  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  podcastId?: number;
}

@ObjectType()
export class GetPodcastOutput extends PaginatorOutput {
  @Field(() => Podcast, { nullable: true })
  podcast?: Podcast;

  @Field(() => [Category], { nullable: true })
  categories?: Category[];

  @Field(() => Rating, { nullable: true })
  myRating?: Rating;
}
