import Container from 'typedi';

import { Post } from '@post/post.entity';
import { PostService } from '@post/post.service';
import { Database } from '@database/index';
import TestHelper from '@testing/test.helper';

describe('PostService', () => {
  const postService = Container.get(PostService);
  const connection = Container.get(Database);
  const mockPost = {
    id: 1,
    user: {
      id: 2,
      firstName: 'John',
      lastName: 'David',
      email: 'john.david@gmail.com',
      password: '123456',
    },
    room: {
      id: 3,
      name: 'Test Room',
    },
    content: 'How about you?',
  } as Post;

  beforeAll(async () => {
    await connection.create();
    await connection.clear();
  });

  afterAll(async () => {
    await connection.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PostService.getById', () => {
    test('Should return data when post id is exist', async () => {
      const postRepository = TestHelper.mockRepository(Post);
      const getRepository = postRepository.getRepository();
      getRepository.getOne.mockResolvedValue(mockPost);
      jest.spyOn(Post, 'getRepository').mockImplementation(() => getRepository);
      const result = await postService.getById(1);
      expect(result).toEqual(mockPost);
    });

    test('Should throw an error when post id is not exist', async () => {
      const postRepository = TestHelper.mockRepository(Post);
      const getRepository = postRepository.getRepository();
      getRepository.getOne.mockResolvedValue(undefined);
      jest.spyOn(Post, 'getRepository').mockImplementation(() => getRepository);
      expect(postService.getById(1)).rejects.toThrow();
    });
  });

  describe('PostService.getPostsByRoomId', () => {
    test('Should return list of posts when room id is exist', async () => {
      const postRepository = TestHelper.mockRepository(Post);
      const getRepository = postRepository.getRepository();
      getRepository.getMany.mockResolvedValue([mockPost]);
      jest.spyOn(Post, 'getRepository').mockImplementation(() => getRepository);
      const result = await postService.getPostsByRoomId(1);
      expect(result).toEqual([mockPost]);
    });
  });

  describe('PostService.create', () => {
    test('Should return data when creating a post successfully', async () => {
      const create: any = {
        save: () => mockPost,
      };
      const createSpy = jest
        .spyOn(Post, 'create')
        .mockImplementation(() => create);

      expect(await postService.create(mockPost)).toEqual(mockPost);
      expect(createSpy).toHaveBeenCalled();
    });
  });

  describe('PostService.remove', () => {
    test('Should remove post successfully', async () => {
      const remove: any = true;
      const removeSpy = jest
        .spyOn(Post, 'remove')
        .mockImplementation(() => remove);
      await postService.remove(mockPost);
      expect(removeSpy).toHaveBeenCalled();
    });
  });
});
