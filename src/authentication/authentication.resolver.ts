import { Service } from 'typedi';
import { Resolver, Mutation, Arg } from 'type-graphql';
import { hashSync, compareSync } from 'bcryptjs';

import { User } from '@user/types';
import {
  RegisterUserInput,
  LoginUserInput,
  AuthenticationResponse,
} from './types';
import { AuthenticationService } from '@authentication/authentication.service';
import { UserService } from '@user/user.service';
import { createAccessToken } from '@authentication/authentication.helper';
import { LOGIN_ERROR } from '@constants/errorMessage';

@Service()
@Resolver(() => User)
class AuthenticationResolver {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => AuthenticationResponse)
  async registerUser(
    @Arg('RegisterUserInput') registerUserInput: RegisterUserInput,
  ): Promise<AuthenticationResponse> {
    registerUserInput.password = hashSync(registerUserInput.password, 12);
    const createdUser = await this.authenticationService.register(
      registerUserInput,
    );

    return {
      accessToken: createAccessToken(createdUser),
      user: createdUser,
    };
  }

  @Mutation(() => AuthenticationResponse)
  async loginUser(
    @Arg('LoginUserInput') loginUserInput: LoginUserInput,
  ): Promise<AuthenticationResponse> {
    const { email, password } = loginUserInput;
    const loginUser = await this.userService.getByEmail(email);

    // Throw error message when has no user
    if (!loginUser) {
      throw Error(LOGIN_ERROR);
    }

    // Check password is match or not
    const isValid = compareSync(password, loginUser.password);

    if (!isValid) {
      throw Error(LOGIN_ERROR);
    }

    return {
      accessToken: createAccessToken(loginUser),
      user: loginUser,
    };
  }
}

export { AuthenticationResolver };
