import { Service } from 'typedi';
import {
  Query,
  Resolver,
  Arg,
  Authorized,
  Mutation,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql';

import {
  POST_REMOVE_ERROR,
  PARTICIPANT_NOT_EXIST_ERROR,
} from '@constants/errorMessage';
import { User } from '@user/types';
import { Room } from '@room/types';
import { CreatePostToChatRoomInput, GetPostByRoomIdInput, Post } from './types';
import { UserService } from '@user/user.service';
import { RoomService } from '@room/room.service';
import { PostService } from '@post/post.service';
import { ParticipantService } from '@participant/participant.service';

@Service()
@Resolver((of) => Post)
class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly participantService: ParticipantService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  @Query(() => [Post])
  @Authorized()
  async getPostsByRoomId(
    @Arg('GetPostByRoomIdInput') getPostByRoomIdInput: GetPostByRoomIdInput,
    @Ctx() context: any,
  ): Promise<Post[]> {
    const { roomId, first, offset } = getPostByRoomIdInput;
    const participant = await this.participantService.getByUserAndRoom(
      context.userId,
      roomId,
    );

    if (!participant) {
      throw Error(PARTICIPANT_NOT_EXIST_ERROR);
    }

    return await this.postService.getPostsByRoomId(roomId, first, offset);
  }

  @Mutation(() => Post)
  @Authorized()
  async createPost(
    @Arg('CreatePostToChatRoomInput')
    createPostToChatRoomInput: CreatePostToChatRoomInput,
    @Ctx() context: any,
  ): Promise<Post> {
    const { roomId, content } = createPostToChatRoomInput;
    const userId = context.userId;

    // Create a post
    const createdPost = await this.postService.create({
      userId,
      roomId,
      content,
    });

    return createdPost;
  }

  @Mutation(() => Post)
  @Authorized()
  async removePost(
    @Arg('postId') postId: number,
    @Ctx() context: any,
  ): Promise<Post> {
    const post = await this.postService.getById(postId);

    // Just remove a post by owner post
    if (post.userId !== context.userId) {
      throw Error(POST_REMOVE_ERROR);
    }

    await this.postService.remove(post);

    return {
      ...post,
      id: postId,
    };
  }

  @FieldResolver(() => User)
  @Authorized()
  async user(@Root() post: Post): Promise<User> {
    return await this.userService.getById(post.userId);
  }

  @FieldResolver(() => Room)
  @Authorized()
  async room(@Root() post: Post): Promise<Room> {
    return await this.roomService.getById(post.roomId);
  }
}

export { PostResolver };
