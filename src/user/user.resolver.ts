import { Service } from 'typedi';
import { Query, Resolver, Arg, Authorized } from 'type-graphql';

import { User } from './types';
import { UserService } from '@user/user.service';

@Service()
@Resolver(() => User)
class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { nullable: true })
  @Authorized()
  async getUsers(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Query(() => User, { nullable: true })
  @Authorized()
  async getUser(@Arg('email') email: string): Promise<User> {
    return await this.userService.getByEmail(email);
  }
}

export { UserResolver };
