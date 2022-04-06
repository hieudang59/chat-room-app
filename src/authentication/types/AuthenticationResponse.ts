import { Field, ObjectType } from 'type-graphql';

import { User } from '@user/user.entity';

@ObjectType()
class UserResponse implements Partial<User> {
  @Field()
  id!: number;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}

@ObjectType()
class AuthenticationResponse {
  @Field()
  accessToken!: string;

  @Field()
  user!: UserResponse;
}

export { AuthenticationResponse };
