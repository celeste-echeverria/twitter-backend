import { PostServiceImpl } from '@domains/post/service';
import { PostRepository } from '@domains/post/repository';
import { UserService } from '@domains/user/service';
import { FollowService } from '@domains/follow/service';
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '@domains/post/dto';
import { InternalServerErrorException, NotFoundException, ForbiddenException } from '@utils/errors';
import { jest } from '@jest/globals';
import * as validator from 'class-validator';
import { CursorPagination } from '@types';
import { UserViewDTO } from '@domains/user/dto';

// Mock repositories and services
const mockPostRepository: jest.Mocked<PostRepository> = {
  create: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  incrementRetweetsCount: jest.fn(),
  incrementLikesCount: jest.fn(),
  incrementRepliesCount: jest.fn(),
  getAllByDatePaginated: jest.fn(),
  getByAuthorId: jest.fn(),
  getCommentsByMainPostId: jest.fn(),
} as any;

const mockUserService: jest.Mocked<UserService> = {
  getUser: jest.fn(),
  isPublic: jest.fn(),
  getPublicUsersIds: jest.fn(),
} as any;

const mockFollowService: jest.Mocked<FollowService> = {
  getFollowedUsersId: jest.fn(),
  userIsFollowing: jest.fn(),
} as any;


const postService = new PostServiceImpl(mockPostRepository, mockUserService, mockFollowService);

describe('PostServiceImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const userId = 'user-id';
      const body = new CreatePostInputDTO();
      body.content = 'This is a post content';
      const postDTO: PostDTO = {
        id: 'id',
        authorId: 'authorid',
        content: body.content,
        createdAt: new Date(),
        parentId: null
      }

      jest.spyOn(validator, 'validate').mockResolvedValue([]);
      mockPostRepository.create.mockResolvedValue(postDTO);

      const result = await postService.createPost(userId, body);

      expect(result).toEqual(postDTO);
      expect(mockPostRepository.create).toHaveBeenCalledWith(userId, body);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const userId = 'user-id';
      const content = new CreatePostInputDTO();
      content.content = 'This is a post content';

      jest.spyOn(validator, 'validate').mockResolvedValue([]);
      mockPostRepository.create.mockRejectedValue(new Error('Repository error'));

      await expect(postService.createPost(userId, content))
        .rejects.toThrow(new InternalServerErrorException('createPost'));
    });
  });
  
  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      const userId = 'user-id';
      const postId = 'post-id';
      const post = { id: postId, authorId: userId };

      mockPostRepository.getById.mockResolvedValue(post as any);
      mockPostRepository.delete.mockResolvedValue(undefined);

      await postService.deletePost(userId, postId);

      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId);
      expect(mockPostRepository.delete).toHaveBeenCalledWith(postId);
    });

    it('should throw NotFoundException if post not found', async () => {
      const userId = 'user-id';
      const postId = 'post-id';

      mockPostRepository.getById.mockResolvedValue(null);

      await expect(postService.deletePost(userId, postId))
        .rejects.toThrow(new NotFoundException('Post'));
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      const userId = 'user-id';
      const postId = 'post-id';
      const post = { id: postId, authorId: 'another-user-id' };

      mockPostRepository.getById.mockResolvedValue(post as any);

      await expect(postService.deletePost(userId, postId))
        .rejects.toThrow(new ForbiddenException());
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const userId = 'user-id';
      const postId = 'post-id';
      const post = { id: postId, authorId: userId };

      mockPostRepository.getById.mockResolvedValue(post as any);
      mockPostRepository.delete.mockRejectedValue(new Error('Repository error'));

      await expect(postService.deletePost(userId, postId))
        .rejects.toThrow(new InternalServerErrorException('deletePost'));
    });
  });
  
  describe('getPost', () => {
    it('should get a post successfully', async () => {
      const userId = 'user-id';
      const postId = 'post-id';
      const author: UserViewDTO = {
        id: 'id',
        name: 'name',
        profilePicture: null,
        username: 'username'
      };
      const extendedPostDTO: ExtendedPostDTO = {
        id: 'id',
        authorId: 'authorid',
        content: 'This is a post content',
        createdAt: new Date(),
        parentId: null,
        author,
        qtyComments: 0, qtyLikes: 0, qtyRetweets: 0
      };
  
      mockPostRepository.getById.mockResolvedValue(extendedPostDTO);
      jest.spyOn(postService, 'canAccessUsersPosts').mockResolvedValue(true);
  
      const result = await postService.getPost(userId, postId);
  
      expect(result).toEqual(extendedPostDTO);
      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId);
    });
    
    it('should throw NotFoundException if post not found', async () => {
      const userId = 'user-id';
      const postId = 'post-id';
  
      mockPostRepository.getById.mockResolvedValue(null);
  
      await expect(postService.getPost(userId, postId))
        .rejects.toThrow(new NotFoundException('Post'));
    });
  
    it('should throw InternalServerErrorException on repository error', async () => {
      const userId = 'user-id';
      const postId = 'post-id';
  
      mockPostRepository.getById.mockRejectedValue(new Error('Repository error'));
  
      await expect(postService.getPost(userId, postId))
        .rejects.toThrow(new InternalServerErrorException('getPost'));
    });
  });  

  describe('incrementPostRetweetsCount', () => {
    it('should increment retweets count successfully', async () => {
      const postId = 'post-id';

      await postService.incrementPostRetweetsCount(postId);

      expect(mockPostRepository.incrementRetweetsCount).toHaveBeenCalledWith(postId);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const postId = 'post-id';

      mockPostRepository.incrementRetweetsCount.mockRejectedValue(new Error('Repository error'));

      await expect(postService.incrementPostRetweetsCount(postId))
        .rejects.toThrow(new InternalServerErrorException('incrementPostReactionCount'));
    });
  });
  
  describe('incrementPostLikesCount', () => {
    it('should increment likes count successfully', async () => {
      const postId = 'post-id';

      await postService.incrementPostLikesCount(postId);

      expect(mockPostRepository.incrementLikesCount).toHaveBeenCalledWith(postId);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const postId = 'post-id';

      mockPostRepository.incrementLikesCount.mockRejectedValue(new Error('Repository error'));

      await expect(postService.incrementPostLikesCount(postId))
        .rejects.toThrow(new InternalServerErrorException('incrementPostReactionCount'));
    });
  });

  describe('incrementPostRepliesCount', () => {
    it('should increment replies count successfully', async () => {
      const postId = 'post-id';

      await postService.incrementPostRepliesCount(postId);

      expect(mockPostRepository.incrementRepliesCount).toHaveBeenCalledWith(postId);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const postId = 'post-id';

      mockPostRepository.incrementRepliesCount.mockRejectedValue(new Error('Repository error'));

      await expect(postService.incrementPostRepliesCount(postId))
        .rejects.toThrow(new InternalServerErrorException('incrementPostReactionCount'));
    });
  });

  describe('getLatestPosts', () => {
    it('should return latest posts from followed and public authors', async () => {
      const userId = 'user-id';
      const options: CursorPagination = { limit: 10, after: '2024-07-01T00:00:00Z' };
      const followedAuthorIds = ['followed-id1', 'followed-id2'];
      const publicAuthorIds = ['public-id1', 'public-id2'];
      const visibleAuthorIds = [...new Set([...followedAuthorIds, ...publicAuthorIds])];
      const posts = [{ id: 'post-id1' }];

      mockFollowService.getFollowedUsersId.mockResolvedValue(followedAuthorIds);
      mockUserService.getPublicUsersIds.mockResolvedValue(publicAuthorIds);
      mockPostRepository.getAllByDatePaginated.mockResolvedValue(posts as any);

      const result = await postService.getLatestPosts(userId, options);

      expect(result).toEqual(posts);
      expect(mockFollowService.getFollowedUsersId).toHaveBeenCalledWith(userId);
      expect(mockUserService.getPublicUsersIds).toHaveBeenCalled();
      expect(mockPostRepository.getAllByDatePaginated).toHaveBeenCalledWith(visibleAuthorIds, options);
    });

    it('should throw InternalServerErrorException on repository or service error', async () => {
      const userId = 'user-id';
      const options: CursorPagination = { limit: 10, after: '2024-07-01T00:00:00Z' };

      mockFollowService.getFollowedUsersId.mockRejectedValue(new Error('Service error'));
      await expect(postService.getLatestPosts(userId, options))
        .rejects.toThrow(new InternalServerErrorException('getLatestPosts'));

      mockFollowService.getFollowedUsersId.mockResolvedValue(['followed-id']);
      mockUserService.getPublicUsersIds.mockRejectedValue(new Error('Service error'));
      await expect(postService.getLatestPosts(userId, options))
        .rejects.toThrow(new InternalServerErrorException('getLatestPosts'));

      mockUserService.getPublicUsersIds.mockResolvedValue(['public-id']);
      mockPostRepository.getAllByDatePaginated.mockRejectedValue(new Error('Repository error'));
      await expect(postService.getLatestPosts(userId, options))
        .rejects.toThrow(new InternalServerErrorException('getLatestPosts'));
    });
  });

  describe('canAccessUsersPosts', () => {
    
    it('should return true if user is the author', async () => {
      const userId = 'user-id';
      const authorId = 'user-id';
      const result = await postService.canAccessUsersPosts(userId, authorId);
      expect(result).toBe(true);
    });

    it('should return true if the author is public', async () => {
      const userId = 'user-id';
      const authorId = 'author-id';
      mockUserService.isPublic.mockResolvedValue(true);
      const result = await postService.canAccessUsersPosts(userId, authorId);
      expect(result).toBe(true);
    });

    it('should return true if the user is following the author', async () => {
      const userId = 'user-id';
      const authorId = 'author-id';
      mockFollowService.userIsFollowing.mockResolvedValue(true);
      const result = await postService.canAccessUsersPosts(userId, authorId);
      expect(result).toBe(true);
    });


  });
  
});
