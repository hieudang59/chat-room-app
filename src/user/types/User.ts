import { Field, ObjectType } from 'type-graphql';

import { Participant } from '@participant/types';

@ObjectType()
class User {
  @Field()
  id!: number;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field(() => [Participant])
  participants!: Participant[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}

export { User };
