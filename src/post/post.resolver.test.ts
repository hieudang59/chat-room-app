import { getRepository, Repository } from 'typeorm';
import Container from 'typedi';

import { User } from '@user/user.entity';
import { Post } from '@post/post.entity';
import { Room } from '@room/room.entity';
import { Participant } from '@participant/participant.entity';
import { Database } from '@database/index';
import { createAccessToken } from '@authentication/authentication.helper';
import {
  ACCESS_DENIED,
  POST_REMOVE_ERROR,
  PARTICIPANT_NOT_EXIST_ERROR,
} from '@constants/errorMessage';
import TestHelper from '@testing/test.helper';

describe('PostResolver', () => {
  let mockUser: User;
  let mockUser2: User;
  let mockRoom: Room;
  let mockPost: Post;
  let mockPost2: Post;
  let mockPost3: Post;
  let mockAccessToken: string;
  let mockUnauthorizedAccessToken: string;

  let userRepository: Repository<User>;
  let roomRepository: Repository<Room>;
  let postRepository: Repository<Post>;
  let participantRepostiry: Repository<Participant>;

  const connection = Container.get(Database);

  const mockUserData = {
    firstName: 'John',
    lastName: 'David',
    email: 'john.david@gmail.com',
    password: '123456',
  };
  const mockUserData2 = {
    firstName: 'Antony',
    lastName: 'Jhosua',
    email: 'antony.jhosua@gmail.com',
    password: '123456',
  };
  const mockRoomData = {
    name: 'Test Room',
  };

  let mockPostData = {
    content: 'How about you?',
  } as Post;
  let mockPostData2 = {
    content: 'Where are you now?',
  } as Post;
  let mockPostData3 = {
    content: '^^',
  } as Post;

  beforeAll(async () => {
    await connection.create();
    await connection.clear();

    userRepository = getRepository(User);
    roomRepository = getRepository(Room);
    postRepository = getRepository(Post);
    participantRepostiry = getRepository(Participant);
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    // Create user and room data, because SQL foreign key constraint when creating post data
    mockUser = await userRepository.save(mockUserData);
    mockUser2 = await userRepository.save(mockUserData2);
    mockRoom = await roomRepository.save(mockRoomData);

    // Merged userId, roomId to post data
    mockPostData.userId = mockUser.id;
    mockPostData.roomId = mockRoom.id;
    mockPostData2.userId = mockUser.id;
    mockPostData2.roomId = mockRoom.id;
    mockPostData3.userId = mockUser.id;
    mockPostData3.roomId = mockRoom.id;

    mockPost = await postRepository.save(mockPostData);
    mockPost2 = await postRepository.save(mockPostData2);
    mockPost3 = await postRepository.save(mockPostData3);
    await participantRepostiry.save({
      user: mockUser,
      room: mockRoom,
    });

    // Generate access token for testing
    mockAccessToken = createAccessToken(mockUser);
    mockUnauthorizedAccessToken = createAccessToken(mockUser2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PostResolver.getPostsByRoomId', () => {
    const getPostsByRoomIdQuery = (
      roomId: number,
      first?: number,
      offset?: number,
    ): string => `
      query {
        getPostsByRoomId(
          GetPostByRoomIdInput: {
            roomId: ${roomId},
            first: ${first || 10},
            offset: ${offset || 0}
          }
        ) {
          id,
          content,
          user {
            id,
            firstName,
            lastName,
          },
          room {
            id,
            name,
          }
        }
      }
    `;

    test('Should return all of posts of a room when room id is exist, page 1', async (): Promise<void> => {
      const { status, body } = await TestHelper.callApi(
        getPostsByRoomIdQuery(mockRoom.id, 2),
        mockAccessToken,
      );

      expect(status).toEqual(200);
      expect(body.data.getPostsByRoomId).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: mockPost.id,
            content: mockPost.content,
          }),
          expect.objectContaining({
            id: mockPost2.id,
            content: mockPost2.content,
          }),
        ]),
      );
    });

    test('Should return all of posts of a room when room id is exist, page 2', async (): Promise<void> => {
      const { status, body } = await TestHelper.callApi(
        getPostsByRoomIdQuery(mockRoom.id, 2, 2),
        mockAccessToken,
      );

      expect(status).toEqual(200);
      expect(body.data.getPostsByRoomId).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: mockPost3.id,
            content: mockPost3.content,
          }),
        ]),
      );
    });

    test('Should return an error of a room when room id is not exist', async (): Promise<void> => {
      const { status, body } = await TestHelper.callApi(
        getPostsByRoomIdQuery(-1),
        mockAccessToken,
      );

      expect(status).toEqual(200);
      expect(body.errors[0].message).toEqual(PARTICIPANT_NOT_EXIST_ERROR);
    });

    test('Should return an error when user is not in chat room', async (): Promise<void> => {
      const { status, body } = await TestHelper.callApi(
        getPostsByRoomIdQuery(mockRoom.id),
        mockUnauthorizedAccessToken,
      );

      expect(status).toEqual(200);
      expect(body.errors[0].message).toEqual(PARTICIPANT_NOT_EXIST_ERROR);
    });

    test('Should return an error when user is unauthenticated', async (): Promise<void> => {
      const { status, body } = await TestHelper.callApi(
        getPostsByRoomIdQuery(mockRoom.id),
      );

      expect(status).toEqual(200);
      expect(body.errors[0].message).toEqual(ACCESS_DENIED);
    });
  });

  describe('PostResolver.createPost', () => {
    const buildCreatePostMutation = (roomId: number, content: string) => `
      mutation {
        createPost(
          CreatePostToChatRoomInput: {
            roomId: ${roomId},
            content: "${content}"
          }
        ) {
          id,
          userId,
          roomId,
          content
        }
      }
    `;

    test('Should return a post data when creating sucessfully', async (): Promise<void> => {
      const mockConent = 'Testing content';
      const { status, body } = await TestHelper.callApi(
        buildCreatePostMutation(mockRoom.id, mockConent),
        mockAccessToken,
      );

      expect(status).toEqual(200);
      expect(body.data.createPost).toEqual(
        expect.objectContaining({
          userId: mockUser.id,
          roomId: mockRoom.id,
          content: mockConent,
        }),
      );
    });

    test('Should return an error when creating failed', async (): Promise<void> => {
      const mockConent = 'Testing content';
      const { status, body } = await TestHelper.callApi(
        buildCreatePostMutation(mockRoom.id, mockConent),
      );

      expect(status).toEqual(200);
      expect(body.errors[0].message).toEqual(ACCESS_DENIED);
    });
  });

  describe('PostResolver.removePost', () => {
    const buildRemovePostMutation = (postId: number) => `
      mutation {
        removePost(postId: ${postId}) {
          id,
          userId,
          roomId,
          content
        }
      }
    `;

    test('Should return a post data when removing successfully', async (): Promise<void> => {
      const { status, body } = await TestHelper.callApi(
        buildRemovePostMutation(mockPost.id),
        mockAccessToken,
      );

      expect(status).toEqual(200);
      expect(body.data.removePost).toEqual(
        expect.objectContaining({
          id: mockPost.id,
          userId: mockUser.id,
          roomId: mockRoom.id,
          content: mockPost.content,
        }),
      );
    });

    test('Should return an error when removing failed', async (): Promise<void> => {
      const { status, body } = await TestHelper.callApi(
        buildRemovePostMutation(mockPost.id),
        mockUnauthorizedAccessToken,
      );

      expect(status).toEqual(200);
      expect(body.errors[0].message).toEqual(POST_REMOVE_ERROR);
    });
  });
});
