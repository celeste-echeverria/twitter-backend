import { FollowServiceImpl } from '@domains/follow/service';
import { FollowRepository } from '@domains/follow/repository';
import { ConflictException, InternalServerErrorException } from '@utils/errors';
import { FollowDTO } from '@domains/follow/dto';
import { UserDTO } from '@domains/user/dto';
import { jest } from '@jest/globals';

// Mock de FollowRepository

const mockRepository: jest.Mocked<FollowRepository> = {
    getFollowByUsersId: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    isFollowing: jest.fn(),
    getFollowedUsersIds: jest.fn(),
    getFollowers: jest.fn(),
    getFollowing: jest.fn(),
} as any;

const followService = new FollowServiceImpl(mockRepository);

describe('FollowServiceImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('follow', () => {
    it('should follow a user successfully', async () => {
      const followerId = 'follower-id';
      const followedId = 'followed-id';
      const followDTO = new FollowDTO({
        id: 'follow-id',
        followerId,
        followedId,
        createdAt: new Date(),
      });

      mockRepository.getFollowByUsersId.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(followDTO);

      const result = await followService.follow(followerId, followedId);

      expect(result).toEqual(followDTO);
      expect(mockRepository.getFollowByUsersId).toHaveBeenCalledWith(followerId, followedId);
      expect(mockRepository.create).toHaveBeenCalledWith(followerId, followedId);
    });

    it('should throw ConflictException if following self', async () => {
      const followerId = 'user-id';
      const followedId = 'user-id';

      await expect(followService.follow(followerId, followedId))
        .rejects.toThrow(new ConflictException('CANNOT_FOLLOW_SELF'));
    });

    it('should throw ConflictException if already following user', async () => {
      const followerId = 'follower-id';
      const followedId = 'followed-id';

      mockRepository.getFollowByUsersId.mockResolvedValue({ id: 'follow-id', followedId, followerId, createdAt: new Date()});

      await expect(followService.follow(followerId, followedId))
        .rejects.toThrow(new ConflictException('ALREADY_FOLLOWING_USER'));
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const followerId = 'follower-id';
      const followedId = 'followed-id';

      mockRepository.getFollowByUsersId.mockRejectedValue(new Error('Repository error'));

      await expect(followService.follow(followerId, followedId))
        .rejects.toThrow(new InternalServerErrorException('follow'));
    });
  });

  describe('unfollow', () => {
    it('should unfollow a user successfully', async () => {
      const followerId = 'follower-id';
      const followedId = 'followed-id';
      const follow = {  id: 'follow-id', followedId, followerId, createdAt: new Date() };

      mockRepository.getFollowByUsersId.mockResolvedValue(follow);
      mockRepository.delete.mockResolvedValue(undefined);

      await followService.unfollow(followerId, followedId);

      expect(mockRepository.getFollowByUsersId).toHaveBeenCalledWith(followerId, followedId);
      expect(mockRepository.delete).toHaveBeenCalledWith(follow.id);
    });

    it('should throw ConflictException if unfollowing self', async () => {
      const followerId = 'user-id';
      const followedId = 'user-id';

      await expect(followService.unfollow(followerId, followedId))
        .rejects.toThrow(new ConflictException('CANNOT_UNFOLLOW_SELF'));
    });

    it('should throw ConflictException if not following user', async () => {
      const followerId = 'follower-id';
      const followedId = 'followed-id';

      mockRepository.getFollowByUsersId.mockResolvedValue(null);

      await expect(followService.unfollow(followerId, followedId))
        .rejects.toThrow(new ConflictException('NOT_FOLLOWING_USER'));
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const followerId = 'follower-id';
      const followedId = 'followed-id';

      mockRepository.getFollowByUsersId.mockRejectedValue(new Error('Repository error'));

      await expect(followService.unfollow(followerId, followedId))
        .rejects.toThrow(new InternalServerErrorException('unfollow'));
    });
  });

  describe('userIsFollowing', () => {
    it('should return true if user is following', async () => {
      const followerId = 'follower-id';
      const followedId = 'followed-id';

      mockRepository.isFollowing.mockResolvedValue(true);

      const result = await followService.userIsFollowing(followerId, followedId);

      expect(result).toBe(true);
      expect(mockRepository.isFollowing).toHaveBeenCalledWith(followerId, followedId);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const followerId = 'follower-id';
      const followedId = 'followed-id';

      mockRepository.isFollowing.mockRejectedValue(new Error('Repository error'));

      await expect(followService.userIsFollowing(followerId, followedId))
        .rejects.toThrow(new InternalServerErrorException('userIsFollowing'));
    });
  });

  describe('getFollowedUsersId', () => {
    it('should return a list of followed user IDs', async () => {
      const followerId = 'follower-id';
      const followedUserIds = ['user-id1', 'user-id2'];

      mockRepository.getFollowedUsersIds.mockResolvedValue(followedUserIds);

      const result = await followService.getFollowedUsersId(followerId);

      expect(result).toEqual(followedUserIds);
      expect(mockRepository.getFollowedUsersIds).toHaveBeenCalledWith(followerId);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const followerId = 'follower-id';

      mockRepository.getFollowedUsersIds.mockRejectedValue(new Error('Repository error'));

      await expect(followService.getFollowedUsersId(followerId))
        .rejects.toThrow(new InternalServerErrorException('getFollowedUsersId'));
    });
  });

  describe('getFollowersByUserId', () => {
    it('should return a list of follower user DTOs', async () => {
      const userId = 'user-id';
      const followers: UserDTO[] = [{ id: 'follower-id', name: 'Follower' }] as UserDTO[];

      mockRepository.getFollowers.mockResolvedValue(followers);

      const result = await followService.getFollowersByUserId(userId);

      expect(result).toEqual(followers);
      expect(mockRepository.getFollowers).toHaveBeenCalledWith(userId);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const userId = 'user-id';

      mockRepository.getFollowers.mockRejectedValue(new Error('Repository error'));

      await expect(followService.getFollowersByUserId(userId))
        .rejects.toThrow(new InternalServerErrorException('getFollowerByUserId'));
    });
  });

  describe('getFollowingByUserId', () => {
    it('should return a list of following user DTOs', async () => {
      const userId = 'user-id';
      const following: UserDTO[] = [{ id: 'following-id', name: 'Following' }] as UserDTO[];

      mockRepository.getFollowing.mockResolvedValue(following);

      const result = await followService.getFollowingByUserId(userId);

      expect(result).toEqual(following);
      expect(mockRepository.getFollowing).toHaveBeenCalledWith(userId);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const userId = 'user-id';

      mockRepository.getFollowing.mockRejectedValue(new Error('Repository error'));

      await expect(followService.getFollowingByUserId(userId))
        .rejects.toThrow(new InternalServerErrorException('getFollowingByUserId'));
    });
  });
});
