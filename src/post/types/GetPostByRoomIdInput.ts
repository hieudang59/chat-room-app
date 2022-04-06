import { Field, InputType } from 'type-graphql';

import { PaginationInput } from './PaginationInput';

@InputType()
class GetPostByRoomIdInput extends PaginationInput {
  @Field()
  roomId!: number;
}

export { GetPostByRoomIdInput };
