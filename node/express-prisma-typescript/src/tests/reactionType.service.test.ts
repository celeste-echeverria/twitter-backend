import { ReactionTypeServiceImpl } from '@domains/reactionType/services';
import { ReactionTypeRepository, ReactionTypeRepositoryImpl } from '@domains/reactionType/repository';
import { InternalServerErrorException, NotFoundException } from '@utils/errors';
import { ReactionTypeDTO } from '@domains/reactionType/dto';
import { jest } from '@jest/globals';

// Mock de ReactionTypeRepository
const mockRepository: jest.Mocked<ReactionTypeRepository> = {
    create: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    getByTypeName: jest.fn(),
    getReactionTypes: jest.fn(),
} as any;

const reactionTypeService = new ReactionTypeServiceImpl(mockRepository);

describe('ReactionTypeServiceImpl', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createReactionType', () => {
        it('should create a reaction type successfully', async () => {
            const reactionTypeName = 'Like';
            const reactionTypeDTO = { id: 'reaction-type-id', typeName: reactionTypeName } as ReactionTypeDTO;

            mockRepository.create.mockResolvedValue(reactionTypeDTO);

            const result = await reactionTypeService.createReactionType(reactionTypeName);

            expect(result).toEqual(reactionTypeDTO);
            expect(mockRepository.create).toHaveBeenCalledWith(reactionTypeName);
        });

        it('should throw InternalServerErrorException on repository error', async () => {
            const reactionTypeName = 'Like';

            mockRepository.create.mockRejectedValue(new Error('Repository error'));

            await expect(reactionTypeService.createReactionType(reactionTypeName))
                .rejects.toThrow(new InternalServerErrorException('createReactionType'));
        });
    });

    describe('deleteReactionType', () => {
        it('should delete a reaction type successfully', async () => {
            const reactionTypeId = 'reaction-type-id';

            mockRepository.delete.mockResolvedValue(undefined);

            await reactionTypeService.deleteReactionType(reactionTypeId);

            expect(mockRepository.delete).toHaveBeenCalledWith(reactionTypeId);
        });

        it('should throw InternalServerErrorException on repository error', async () => {
            const reactionTypeId = 'reaction-type-id';

            mockRepository.delete.mockRejectedValue(new Error('Repository error'));

            await expect(reactionTypeService.deleteReactionType(reactionTypeId))
                .rejects.toThrow(new InternalServerErrorException('deleteReactionType'));
        });
    });

    describe('getReactionTypeById', () => {
        it('should return a reaction type by id successfully', async () => {
            const reactionTypeId = 'reaction-type-id';
            const reactionTypeDTO = { id: reactionTypeId, typeName: 'Like' } as ReactionTypeDTO;

            mockRepository.getById.mockResolvedValue(reactionTypeDTO);

            const result = await reactionTypeService.getReactionTypeById(reactionTypeId);

            expect(result).toEqual(reactionTypeDTO);
            expect(mockRepository.getById).toHaveBeenCalledWith(reactionTypeId);
        });

        it('should throw NotFoundException if reaction type not found', async () => {
            const reactionTypeId = 'reaction-type-id';

            mockRepository.getById.mockResolvedValue(null);

            await expect(reactionTypeService.getReactionTypeById(reactionTypeId))
                .rejects.toThrow(new NotFoundException('Reaction Type'));
        });

        it('should throw InternalServerErrorException on repository error', async () => {
            const reactionTypeId = 'reaction-type-id';

            mockRepository.getById.mockRejectedValue(new Error('Repository error'));

            await expect(reactionTypeService.getReactionTypeById(reactionTypeId))
                .rejects.toThrow(new InternalServerErrorException('getReactionTypeById'));
        });
    });

    describe('getReactionByTypeName', () => {
        it('should return a reaction type by type name successfully', async () => {
            const typeName = 'Like';
            const reactionTypeDTO = { id: 'reaction-type-id', typeName } as ReactionTypeDTO;

            mockRepository.getByTypeName.mockResolvedValue(reactionTypeDTO);

            const result = await reactionTypeService.getReactionByTypeName(typeName);

            expect(result).toEqual(reactionTypeDTO);
            expect(mockRepository.getByTypeName).toHaveBeenCalledWith(typeName);
        });

        it('should throw NotFoundException if reaction type not found', async () => {
            const typeName = 'Like';

            mockRepository.getByTypeName.mockResolvedValue(null);

            await expect(reactionTypeService.getReactionByTypeName(typeName))
                .rejects.toThrow(new NotFoundException('Reaction Type'));
        });

        it('should throw InternalServerErrorException on repository error', async () => {
            const typeName = 'Like';

            mockRepository.getByTypeName.mockRejectedValue(new Error('Repository error'));

            await expect(reactionTypeService.getReactionByTypeName(typeName))
                .rejects.toThrow(new InternalServerErrorException('getReactionTypeByName'));
        });
    });

    describe('getReactionTypes', () => {
        it('should return a list of reaction types successfully', async () => {
            const reactionTypes = [
                { id: 'reaction-type-id-1', typeName: 'Like' },
                { id: 'reaction-type-id-2', typeName: 'Love' },
            ] as ReactionTypeDTO[];

            mockRepository.getReactionTypes.mockResolvedValue(reactionTypes);

            const result = await reactionTypeService.getReactionTypes();

            expect(result).toEqual(reactionTypes);
            expect(mockRepository.getReactionTypes).toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException on repository error', async () => {
            mockRepository.getReactionTypes.mockRejectedValue(new Error('Repository error'));

            await expect(reactionTypeService.getReactionTypes())
                .rejects.toThrow(new InternalServerErrorException('getReactionTypeByName'));
        });
    });
});
