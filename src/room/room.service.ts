import { Service } from 'typedi';

import { Room } from '@room/room.entity';
import { CreateChatRoomInput } from './types';
import { ROOM_NOT_EXIST_ERROR } from '@constants/errorMessage';

@Service()
class RoomService {
  getAll = async (): Promise<Room[]> => {
    return await Room.find();
  };

  getById = async (id: number): Promise<Room> => {
    const room = await Room.findOne({ where: { id } });

    if (!room) {
      throw Error(ROOM_NOT_EXIST_ERROR);
    }

    return room;
  };

  create = async (createChatRoomInput: CreateChatRoomInput): Promise<Room> => {
    return await Room.create(createChatRoomInput).save();
  };
}

export { RoomService };
