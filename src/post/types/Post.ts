import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class Post {
  @Field()
  id!: number;

  @Field()
  userId!: number;

  @Field()
  roomId!: number;

  @Field()
  content!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}

export { Post };
