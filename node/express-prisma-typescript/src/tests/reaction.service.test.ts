import { ReactionServiceImpl } from '@domains/reaction/services';
import { ReactionRepository } from '@domains/reaction/repository';
import { PostService } from '@domains/post/service';
import { ReactionTypeService } from '@domains/reactionType/services';
import { ReactionDTO } from '@domains/reaction/dto';
import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException } from '@utils/errors';
import { jest } from '@jest/globals';

// Mocks
const mockReactionRepository: jest.Mocked<ReactionRepository> = {
    create: jest.fn(),
    delete: jest.fn(),
    getReactionById: jest.fn(),
    getReactionsByUserId: jest.fn(),
    getReactionsByPostId: jest.fn(),
    getUserReactionFromPost: jest.fn(),
    getReactionsByUserIdAndType: jest.fn(),
} as any;

const mockPostService: jest.Mocked<PostService> = {
    getPost: jest.fn(),
    incrementPostRetweetsCount: jest.fn(),
    incrementPostLikesCount: jest.fn(),
} as any;

const mockReactionTypeService: jest.Mocked<ReactionTypeService> = {
    getReactionByTypeName: jest.fn(),
} as any;

const reactionService = new ReactionServiceImpl(
    mockReactionRepository,
    mockReactionTypeService,
    mockPostService
);

describe('ReactionServiceImpl', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createReaction', () => {
        it('should create a reaction successfully', async () => {
            const reactionDTO: ReactionDTO = {
                id: 'reaction-id',
                userId: 'user-id',
                postId: 'post-id',
                reactionTypeId: 'reaction-type-id',
                createdAt: new Date()
            };

            mockPostService.getPost.mockResolvedValue({ id: 'post-id' } as any);
            mockReactionTypeService.getReactionByTypeName.mockResolvedValue({ id: 'reaction-type-id' } as any);
            mockReactionRepository.getUserReactionFromPost.mockResolvedValue(null);
            mockReactionRepository.create.mockResolvedValue(reactionDTO);

            const result = await reactionService.createReaction('Like', 'user-id', 'post-id');

            expect(result).toEqual(reactionDTO);
            expect(mockPostService.getPost).toHaveBeenCalledWith('user-id', 'post-id');
            expect(mockReactionTypeService.getReactionByTypeName).toHaveBeenCalledWith('Like');
            expect(mockReactionRepository.getUserReactionFromPost).toHaveBeenCalledWith('user-id', 'post-id', 'reaction-type-id');
            expect(mockReactionRepository.create).toHaveBeenCalledWith('reaction-type-id', 'user-id', 'post-id');
        });

        it('should throw NotFoundException if post not found', async () => {
            mockPostService.getPost.mockResolvedValue(null);

            await expect(reactionService.createReaction('Like', 'user-id', 'post-id'))
                .rejects.toThrow(new NotFoundException('Post'));
        });

        it('should throw BadRequestException if reaction already exists', async () => {
            mockPostService.getPost.mockResolvedValue({ id: 'post-id' } as any);
            mockReactionTypeService.getReactionByTypeName.mockResolvedValue({ id: 'reaction-type-id' } as any);
            mockReactionRepository.getUserReactionFromPost.mockResolvedValue({ id: 'reaction-id' } as any);

            await expect(reactionService.createReaction('Like', 'user-id', 'post-id'))
                .rejects.toThrow(new BadRequestException('Reaction'));
        });

        it('should throw InternalServerErrorException on repository error', async () => {
            mockPostService.getPost.mockResolvedValue({ id: 'post-id' } as any);
            mockReactionTypeService.getReactionByTypeName.mockResolvedValue({ id: 'reaction-type-id' } as any);
            mockReactionRepository.getUserReactionFromPost.mockRejectedValue(new Error('Repository error'));

            await expect(reactionService.createReaction('Like', 'user-id', 'post-id'))
                .rejects.toThrow(new InternalServerErrorException('createReaction'));
        });
    });

    describe('deleteReaction', () => {
        it('should delete a reaction successfully', async () => {
            const reaction: ReactionDTO = {
                id: 'reaction-id',
                userId: 'user-id',
                postId: 'post-id',
                reactionTypeId: 'reaction-type-id',
                createdAt: new Date()
            };
            mockReactionRepository.getReactionById.mockResolvedValue(reaction);
            mockReactionRepository.delete.mockResolvedValue(undefined);

            await reactionService.deleteReaction('reaction-id', 'user-id');

            expect(mockReactionRepository.getReactionById).toHaveBeenCalledWith('reaction-id');
            expect(mockReactionRepository.delete).toHaveBeenCalledWith('reaction-id');
        });

        it('should throw NotFoundException if reaction not found', async () => {
            mockReactionRepository.getReactionById.mockResolvedValue(null);

            await expect(reactionService.deleteReaction('reaction-id', 'user-id'))
                .rejects.toThrow(new NotFoundException('Reaction'));
        });

        it('should throw ForbiddenException if user is not the owner of the reaction', async () => {
            const reactionDTO: ReactionDTO = {
                id: 'reaction-id',
                userId: 'otheruser-id',
                postId: 'post-id',
                reactionTypeId: 'reaction-type-id',
                createdAt: new Date()
            };

            mockReactionRepository.getReactionById.mockResolvedValue(reactionDTO);

            await expect(reactionService.deleteReaction('reaction-id', 'user-id'))
                .rejects.toThrow(new ForbiddenException());
        });

        it('should throw InternalServerErrorException on repository error', async () => {
            mockReactionRepository.getReactionById.mockRejectedValue(new Error('Repository error'));

            await expect(reactionService.deleteReaction('reaction-id', 'user-id'))
                .rejects.toThrow(new InternalServerErrorException('deleteReaction'));
        });
    });

    describe('getUserReactions', () => {
        it('should return a list of user reactions', async () => {
            const reactions: ReactionDTO[] = [{ id: 'reaction-id', userId: 'user-id', postId: 'post-id', reactionTypeId: 'reaction-type-id' }] as ReactionDTO[];

            mockReactionRepository.getReactionsByUserId.mockResolvedValue(reactions);

            const result = await reactionService.getUserReactions('user-id');

            expect(result).toEqual(reactions);
            expect(mockReactionRepository.getReactionsByUserId).toHaveBeenCalledWith('user-id');
        });

        it('should throw InternalServerErrorException on repository error', async () => {
            mockReactionRepository.getReactionsByUserId.mockRejectedValue(new Error('Repository error'));

            await expect(reactionService.getUserReactions('user-id'))
                .rejects.toThrow(new InternalServerErrorException('getUserReactions'));
        });
    });

    describe('getPostReactions', () => {
        it('should return a list of post reactions', async () => {
            const reactions: ReactionDTO[] = [{ id: 'reaction-id', userId: 'user-id', postId: 'post-id', reactionTypeId: 'reaction-type-id' }] as ReactionDTO[];

            mockReactionRepository.getReactionsByPostId.mockResolvedValue(reactions);

            const result = await reactionService.getPostReactions('post-id');

            expect(result).toEqual(reactions);
            expect(mockReactionRepository.getReactionsByPostId).toHaveBeenCalledWith('post-id');
        });

        it('should throw InternalServerErrorException on repository error', async () => {
            mockReactionRepository.getReactionsByPostId.mockRejectedValue(new Error('Repository error'));

            await expect(reactionService.getPostReactions('post-id'))
                .rejects.toThrow(new InternalServerErrorException('getPostReactions'));
        });
    });

    describe('getReaction', () => {
        it('should return a reaction by ID', async () => {
            const reactionDTO: ReactionDTO = {
                id: 'reaction-id',
                userId: 'user-id',
                postId: 'post-id',
                reactionTypeId: 'reaction-type-id',
                createdAt: new Date()
            };

            mockReactionRepository.getReactionById.mockResolvedValue(reactionDTO);

            const result = await reactionService.getReaction('reaction-id');

            expect(result).toEqual(reactionDTO);
            expect(mockReactionRepository.getReactionById).toHaveBeenCalledWith('reaction-id');
        });

        it('should return null if reaction not found', async () => {
            mockReactionRepository.getReactionById.mockResolvedValue(null);

            const result = await reactionService.getReaction('reaction-id');

            expect(result).toBeNull();
        });

        it('should throw InternalServerErrorException on repository error', async () => {
            mockReactionRepository.getReactionById.mockRejectedValue(new Error('Repository error'));

            await expect(reactionService.getReaction('reaction-id'))
                .rejects.toThrow(new InternalServerErrorException('getReaction'));
        });
    });

    describe('getUserLikesOrRetweets', () => {
        it('should return a list of user likes or retweets', async () => {
            const reactions: ReactionDTO[] = [{ id: 'reaction-id', userId: 'user-id', postId: 'post-id', reactionTypeId: 'reaction-type-id' }] as ReactionDTO[];

            mockReactionTypeService.getReactionByTypeName.mockResolvedValue({ id: 'reaction-type-id' } as any);
            mockReactionRepository.getReactionsByUserIdAndType.mockResolvedValue(reactions);

            const result = await reactionService.getUserLikesOrRetweets('user-id', 'Like');

            expect(result).toEqual(reactions);
            expect(mockReactionTypeService.getReactionByTypeName).toHaveBeenCalledWith('Like');
            expect(mockReactionRepository.getReactionsByUserIdAndType).toHaveBeenCalledWith('user-id', 'reaction-type-id');
        });

        it('should throw NotFoundException if reaction type not found', async () => {
            mockReactionTypeService.getReactionByTypeName.mockResolvedValue(null);

            await expect(reactionService.getUserLikesOrRetweets('user-id', 'Like'))
                .rejects.toThrow(new NotFoundException('Reaction Type'));
        });

        it('should throw InternalServerErrorException on repository error', async () => {
            mockReactionTypeService.getReactionByTypeName.mockResolvedValue({ id: 'reaction-type-id' } as any);
            mockReactionRepository.getReactionsByUserIdAndType.mockRejectedValue(new Error('Repository error'));

            await expect(reactionService.getUserLikesOrRetweets('user-id', 'Like'))
                .rejects.toThrow(new InternalServerErrorException('getUserLikesOrRetweets'));
        });
    });
});
