import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthModule } from 'src/auth/auth.module';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { Category } from 'src/podcasts/entities/category.entity';
import { Episode } from 'src/podcasts/entities/episode.entity';
import { Podcast } from 'src/podcasts/entities/podcast.entity';
import { PodcastsModule } from 'src/podcasts/podcasts.module';
import { Rating } from 'src/reviews/entities/rating.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { Users } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .required(),
        POSTGRES_HOST: Joi.string(),
        POSTGRES_PORT: Joi.string(),
        POSTGRES_USERNAME: Joi.string(),
        POSTGRES_PASSWORD: Joi.string(),
        POSTGRES_DATABASE: Joi.string(),
        JWT_PRIVATE_KEY: Joi.string().required(),
        SEED_USER_PASSWORD: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
          }),
      entities: [Users, Category, Podcast, Episode, Review, Rating],
      logging: process.env.NODE_ENV === 'development',
      synchronize: true,
    }),
    JwtModule.forRoot({ privateKey: process.env.JWT_PRIVATE_KEY }),
    UsersModule,
    PodcastsModule,
    ReviewsModule,
    AuthModule,
    AwsS3Module,
  ],
  providers: [SeederService],
})
export class SeederModule {}
