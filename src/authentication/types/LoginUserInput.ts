import { Field, InputType } from 'type-graphql';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

import { User } from '@user/user.entity';

@InputType()
class LoginUserInput implements Partial<User> {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(6)
  @MaxLength(50)
  password!: string;
}

export { LoginUserInput };
