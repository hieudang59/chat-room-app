import { Service } from 'typedi';
import { Query, Resolver, Mutation, Arg, Authorized, Ctx } from 'type-graphql';

import {
  Room,
  CreateChatRoomInput,
  AddUserIntoChatRoomInput,
  LeaveOutChatRoomInput,
  LeaveOutChatRoomResponse,
} from './types';
import { Participant } from '@participant/types';
import { RoomService } from '@room/room.service';
import { ParticipantService } from '@participant/participant.service';
import { USER_EXIST_IN_ROOM_ERROR } from '@constants/errorMessage';

@Service()
@Resolver(() => Room)
class RoomResolver {
  constructor(
    private readonly roomService: RoomService,
    private readonly participantService: ParticipantService,
  ) {}

  @Query(() => [Room])
  @Authorized()
  async getRooms(): Promise<Room[]> {
    return await this.roomService.getAll();
  }

  @Query(() => Room, { nullable: true })
  @Authorized()
  async getRoom(@Arg('id') id: number): Promise<Room> {
    return await this.roomService.getById(id);
  }

  @Mutation(() => Room)
  @Authorized()
  async createChatRoom(
    @Arg('CreateChatRoomInput') createChatRoomInput: CreateChatRoomInput,
    @Ctx() context: any,
  ): Promise<Room> {
    const { userId } = context;

    // Create a chat room first
    const room = await this.roomService.create(createChatRoomInput);

    // Then add this user to participant as well
    await this.participantService.create(userId, room.id);

    return room;
  }

  @Mutation(() => Participant)
  @Authorized()
  async addUserIntoChatRoom(
    @Arg('AddUserIntoChatRoomInput')
    addUserIntoChatRoomInput: AddUserIntoChatRoomInput,
  ): Promise<Participant> {
    const { userId, roomId } = addUserIntoChatRoomInput;

    // Check if the user is added into the room, should skip it
    const existedParticipant = await this.participantService.getByUserAndRoom(
      userId,
      roomId,
    );

    if (existedParticipant) {
      throw Error(USER_EXIST_IN_ROOM_ERROR);
    }

    return await this.participantService.create(userId, roomId);
  }

  @Mutation(() => LeaveOutChatRoomResponse)
  @Authorized()
  async leaveUserFromChatRoom(
    @Arg('LeaveOutChatRoomInput') leaveOutChatRoomInput: LeaveOutChatRoomInput,
    @Ctx() context: any,
  ): Promise<LeaveOutChatRoomResponse> {
    const { roomId } = leaveOutChatRoomInput;
    const { userId } = context;

    const removedParticipant = await this.participantService.getByUserAndRoom(
      userId,
      roomId,
    );

    // Remove participant
    if (removedParticipant) {
      await this.participantService.remove(removedParticipant);
    }

    return removedParticipant as LeaveOutChatRoomResponse;
  }
}

export { RoomResolver };
