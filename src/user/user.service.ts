import { Service } from 'typedi';
import { USER_NOT_EXIST_ERROR } from '@constants/errorMessage';
import { User } from '@user/user.entity';

@Service()
class UserService {
  getAll = async (): Promise<User[]> => {
    return await User.find();
  };

  getById = async (id: number): Promise<User> => {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw Error(USER_NOT_EXIST_ERROR);
    }

    return user;
  };

  getByEmail = async (email: string): Promise<User> => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw Error(USER_NOT_EXIST_ERROR);
    }

    return user;
  };
}

export { UserService };
