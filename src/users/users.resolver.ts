import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { GetFeedOutput } from './dtos/get-feed.dto';
import { GetSubscriptionsOutput } from './dtos/get-subscriptions.dto';
import { LoginInput, LoginOutput } from './dtos/log-in.dto';
import {
  ToggleSubscribeInput,
  ToggleSubscribeOutput,
} from './dtos/toggle-subscribe.dto';
import { Users } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Role(['Any'])
  @Query(() => Users)
  me(@AuthUser() authUser: Users): Users {
    return authUser;
  }

  @Mutation(() => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Role(['Any'])
  @Mutation(() => EditProfileOutput)
  editProfile(
    @AuthUser() authUser: Users,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser, editProfileInput);
  }

  @Role(['Any'])
  @Mutation(() => CoreOutput)
  deleteAccount(@AuthUser() authUser: Users): Promise<CoreOutput> {
    return this.usersService.deleteAccount(authUser);
  }

  @Role(['Listener'])
  @Mutation(() => ToggleSubscribeOutput)
  toggleSubscribe(
    @AuthUser() authUser: Users,
    @Args('input') toggleSubscriptionInput: ToggleSubscribeInput,
  ): Promise<ToggleSubscribeOutput> {
    return this.usersService.toggleSubscribe(authUser, toggleSubscriptionInput);
  }

  @Role(['Listener'])
  @Query(() => GetSubscriptionsOutput)
  getSubscriptions(
    @AuthUser() authUser: Users,
  ): Promise<GetSubscriptionsOutput> {
    return this.usersService.getSubscribtions(authUser);
  }

  @Role(['Listener'])
  @Query(() => GetFeedOutput)
  getFeed(@AuthUser() authUser: Users): Promise<GetFeedOutput> {
    return this.usersService.getFeed(authUser);
  }
}
