import { Field, InputType } from 'type-graphql';

@InputType()
class LeaveOutChatRoomInput {
  @Field()
  roomId!: number;
}

export { LeaveOutChatRoomInput };
