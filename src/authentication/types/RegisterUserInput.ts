import { Field, InputType } from 'type-graphql';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

import { User } from '@user/user.entity';

@InputType()
class RegisterUserInput implements Partial<User> {
  @Field()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @Field()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(6)
  @MaxLength(50)
  password!: string;
}

export { RegisterUserInput };
