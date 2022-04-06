import { Participant } from '@participant/participant.entity';

import { Field, InputType } from 'type-graphql';

@InputType()
class AddUserIntoChatRoomInput implements Partial<Participant> {
  @Field()
  roomId!: number;

  @Field()
  userId!: number;
}

export { AddUserIntoChatRoomInput };
