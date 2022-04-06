import { Field, InputType } from 'type-graphql';

import { Post } from '@post/post.entity';

@InputType()
class CreatePostToChatRoomInput implements Partial<Post> {
  @Field()
  roomId!: number;

  @Field()
  content!: string;
}

export { CreatePostToChatRoomInput };
