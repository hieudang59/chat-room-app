import { Service } from 'typedi';

import { Post } from '@post/post.entity';
import { CreatePostInput } from './types';
import { POST_NOT_EXIST_ERROR } from '@constants/errorMessage';
import { DEFAULT_FIRST, DEFAULT_OFFSET } from '@constants/pagination';

@Service()
class PostService {
  getById = async (id: number): Promise<Post> => {
    const post = await Post.getRepository()
      .createQueryBuilder('post')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw Error(POST_NOT_EXIST_ERROR);
    }

    return post;
  };

  getPostsByRoomId = async (
    roomId: number,
    first?: number,
    offset?: number,
  ): Promise<Post[]> => {
    return await Post.getRepository()
      .createQueryBuilder('post')
      .where('post.roomId = :roomId', { roomId })
      .take(first || DEFAULT_FIRST)
      .skip(offset || DEFAULT_OFFSET)
      .getMany();
  };

  create = async (createPostInput: CreatePostInput): Promise<Post> => {
    return await Post.create(createPostInput).save();
  };

  remove = async (post: Post): Promise<void> => {
    await Post.remove(post);
  };
}

export { PostService };
