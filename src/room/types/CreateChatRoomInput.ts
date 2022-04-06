import { Field, InputType } from 'type-graphql';
import { MaxLength, MinLength } from 'class-validator';

import { Room } from '@room/room.entity';

@InputType()
class CreateChatRoomInput implements Partial<Room> {
  @Field()
  @MinLength(2)
  @MaxLength(50)
  name!: string;
}

export { CreateChatRoomInput };
