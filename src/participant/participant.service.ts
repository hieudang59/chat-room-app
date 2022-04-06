import { Service } from 'typedi';

import { Participant } from '@participant/participant.entity';
import { PARTICIPANT_NOT_EXIST_ERROR } from '@constants/errorMessage';

@Service()
class ParticipantService {
  getAll = async (): Promise<Participant[]> => {
    return await Participant.find();
  };

  getById = async (id: number): Promise<Participant> => {
    const participant = await Participant.findOne({ where: { id } });

    if (!participant) {
      throw Error(PARTICIPANT_NOT_EXIST_ERROR);
    }

    return participant;
  };

  getByUserAndRoom = async (
    userId: number,
    roomId: number,
  ): Promise<Participant | undefined> => {
    const participant = await Participant.getRepository()
      .createQueryBuilder('participant')
      .where('participant.userId = :userId', { userId })
      .andWhere('participant.roomId = :roomId', { roomId })
      .getOne();

    return participant;
  };

  create = async (userId: number, roomId: number): Promise<Participant> => {
    return await Participant.create({ userId, roomId }).save();
  };

  remove = async (participant: Participant): Promise<void> => {
    await Participant.remove(participant);
  };
}

export { ParticipantService };
