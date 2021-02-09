import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { JwtModule } from './jwt/jwt.module';
import { Episode } from './podcasts/entities/episode.entity';
import { Podcast } from './podcasts/entities/podcast.entity';
import { PodcastsModule } from './podcasts/podcasts.module';
import { Review } from './reviews/entities/review.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { Users } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Category } from './podcasts/entities/category.entity';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { Rating } from './reviews/entities/rating.entity';

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
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        JWT_PRIVATE_KEY: Joi.string().required(),
        PORT: Joi.number(),
        // AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
        // AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
        // AWS_S3_BUCKET_NAME: Joi.string().required(),
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
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      context: ({ req }) => ({ user: req['user'] }),
    }),
    JwtModule.forRoot({ privateKey: process.env.JWT_PRIVATE_KEY }),
    UsersModule,
    PodcastsModule,
    ReviewsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.ALL,
    });
  }
}
