import { Field, ObjectType } from 'type-graphql';

import { Post } from '@post/post.entity';

@ObjectType()
class CreatePostInput implements Partial<Post> {
  @Field()
  userId!: number;

  @Field()
  roomId!: number;

  @Field()
  content!: string;
}

export { CreatePostInput };
