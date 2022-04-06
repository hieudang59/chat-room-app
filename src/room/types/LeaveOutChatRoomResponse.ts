import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class LeaveOutChatRoomResponse {
  @Field()
  userId!: number;

  @Field()
  roomId!: number;
}

export { LeaveOutChatRoomResponse };
