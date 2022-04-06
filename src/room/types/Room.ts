import { Field, ObjectType } from 'type-graphql';

import { Participant } from '@participant/types';

@ObjectType()
class Room {
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Field(() => [Participant])
  participants!: Participant[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}

export { Room };
