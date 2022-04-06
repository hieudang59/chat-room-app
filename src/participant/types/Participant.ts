import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class Participant {
  @Field()
  id!: number;

  @Field()
  userId!: number;

  @Field()
  roomId!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}

export { Participant };
