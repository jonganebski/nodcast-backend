import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { Users } from 'src/users/entities/user.entity';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/delete-episode.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dtos/delete-podcast.dto';
import { EditEpisodeInput, EditEpisodeOutput } from './dtos/edit-episode.dto';
import { EditPodcastInput, EditPodcastOutput } from './dtos/edit-podcast.dto';
import { GetCategoriesOutput } from './dtos/get-categories.dto';
import { GetCategoryInput, GetCategoryOutput } from './dtos/get-category.dto';
import { GetPodcastInput, GetPodcastOutput } from './dtos/get-podcast.dto';
import { Category } from './entities/category.entity';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import {
  CategoriesService,
  EpisodesService,
  PodcastsService,
} from './podcasts.service';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => CreateCategoryOutput)
  createCategory(
    @Args('input') createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    return this.categoriesService.createCategory(createCategoryInput);
  }

  @Role(['Any'])
  @Query(() => GetCategoriesOutput)
  getCategories(@AuthUser() authUser: Users): Promise<GetCategoriesOutput> {
    return this.categoriesService.getCategories(authUser);
  }

  @Role(['Listener'])
  @Query(() => GetCategoryOutput)
  getCategory(getCaterogyInput: GetCategoryInput): Promise<GetCategoryOutput> {
    return this.categoriesService.getCategory(getCaterogyInput);
  }
}

@Resolver(() => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Role(['Host'])
  @Mutation(() => CreatePodcastOutput)
  createPodcast(
    @AuthUser() authUser: Users,
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    return this.podcastsService.createPodcast(authUser, createPodcastInput);
  }

  @Role(['Host'])
  @Mutation(() => EditPodcastOutput)
  editPodcast(
    @AuthUser() authUser: Users,
    @Args('input') editPodcastInput: EditPodcastInput,
  ): Promise<EditPodcastOutput> {
    return this.podcastsService.editPodcast(authUser, editPodcastInput);
  }

  @Role(['Host'])
  @Mutation(() => DeletePodcastOutput)
  deletePodcast(
    @AuthUser() authUser: Users,
    @Args('input') deletePodcastInput: DeletePodcastInput,
  ): Promise<DeletePodcastOutput> {
    return this.podcastsService.deletePodcast(authUser, deletePodcastInput);
  }

  @Role(['Any'])
  @Query(() => GetPodcastOutput)
  getPodcast(
    @AuthUser() authUser: Users,
    @Args('input') getPodcastInput: GetPodcastInput,
  ): Promise<GetPodcastOutput> {
    return this.podcastsService.getPodcast(authUser, getPodcastInput);
  }
}

@Resolver(() => Episode)
export class EpisodesResolver {
  constructor(private readonly episodesService: EpisodesService) {}

  @Role(['Host'])
  @Mutation(() => CreateEpisodeOutput)
  createEpisode(
    @AuthUser() authUser: Users,
    @Args('input') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return this.episodesService.createEpisode(authUser, createEpisodeInput);
  }

  @Role(['Host'])
  @Mutation(() => EditEpisodeOutput)
  editEpisode(
    @AuthUser() authUser: Users,
    @Args('input') editEpisodeInput: EditEpisodeInput,
  ): Promise<EditEpisodeOutput> {
    return this.episodesService.editEpisode(authUser, editEpisodeInput);
  }

  @Role(['Host'])
  @Mutation(() => DeleteEpisodeOutput)
  deleteEpisode(
    @AuthUser() authUser: Users,
    @Args('input') deleteEpisodeInput: DeleteEpisodeInput,
  ): Promise<DeleteEpisodeOutput> {
    return this.episodesService.deleteEpisode(authUser, deleteEpisodeInput);
  }
}
