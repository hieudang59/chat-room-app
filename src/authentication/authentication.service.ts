import { Service } from 'typedi';

import { User } from '@user/user.entity';
import { RegisterUserInput } from './types';

@Service()
class AuthenticationService {
  register = async (registerUserInput: RegisterUserInput): Promise<User> => {
    return await User.create(registerUserInput).save();
  };
}

export { AuthenticationService };
