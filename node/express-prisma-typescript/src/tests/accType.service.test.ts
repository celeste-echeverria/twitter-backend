import { AccTypeServiceImpl } from '@domains/accountType/services';
import { AccountTypeDTO } from '@domains/accountType/dto';
import { AccountTypeRepository } from '@domains/accountType/repository';

import { InternalServerErrorException, NotFoundException } from '@utils/errors';

// Mock de AccountTypeRepository
const mockRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    getByTypeName: jest.fn(),
    getAccTypes: jest.fn(),
};

const service = new AccTypeServiceImpl(mockRepository as unknown as AccountTypeRepository);

describe('AccTypeServiceImpl', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createAccType', () => {
        it('should create and return an AccountTypeDTO', async () => {
            const accTypeName = 'Admin';
            const dto = new AccountTypeDTO({ id: '1', typeName: accTypeName });
            mockRepository.create.mockResolvedValue(dto);

            const result = await service.createAccType(accTypeName);
            expect(result).toEqual(dto);
            expect(mockRepository.create).toHaveBeenCalledWith(accTypeName);
        });

        it('should throw InternalServerErrorException if repository fails', async () => {
            const accTypeName = 'Admin';
            mockRepository.create.mockRejectedValue(new Error('Database error'));

            await expect(service.createAccType(accTypeName)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('deleteAccType', () => {
        it('should delete an account type successfully', async () => {
            const accTypeId = '1';
            mockRepository.delete.mockResolvedValue(undefined);

            await expect(service.deleteAccType(accTypeId)).resolves.toBeUndefined();
            expect(mockRepository.delete).toHaveBeenCalledWith(accTypeId);
        });

        it('should throw InternalServerErrorException if repository fails', async () => {
            const accTypeId = '1';
            mockRepository.delete.mockRejectedValue(new Error('Database error'));

            await expect(service.deleteAccType(accTypeId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('getAccTypeById', () => {
        it('should return an AccountTypeDTO if found', async () => {
            const accTypeId = '1';
            const dto = new AccountTypeDTO({ id: accTypeId, typeName: 'Admin' });
            mockRepository.getById.mockResolvedValue(dto);

            const result = await service.getAccTypeById(accTypeId);
            expect(result).toEqual(dto);
            expect(mockRepository.getById).toHaveBeenCalledWith(accTypeId);
        });

        it('should throw NotFoundException if no account type is found', async () => {
            const accTypeId = '1';
            mockRepository.getById.mockResolvedValue(null);

            await expect(service.getAccTypeById(accTypeId)).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException if repository fails', async () => {
            const accTypeId = '1';
            mockRepository.getById.mockRejectedValue(new Error('Database error'));

            await expect(service.getAccTypeById(accTypeId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('getAccTypeByTypeName', () => {
        it('should return an AccountTypeDTO if found', async () => {
            const accTypeName = 'Admin';
            const dto = new AccountTypeDTO({ id: '1', typeName: accTypeName });
            mockRepository.getByTypeName.mockResolvedValue(dto);

            const result = await service.getAccTypeByTypeName(accTypeName);
            expect(result).toEqual(dto);
            expect(mockRepository.getByTypeName).toHaveBeenCalledWith(accTypeName);
        });

        it('should throw NotFoundException if no account type is found', async () => {
            const accTypeName = 'Admin';
            mockRepository.getByTypeName.mockResolvedValue(null);

            await expect(service.getAccTypeByTypeName(accTypeName)).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException if repository fails', async () => {
            const accTypeName = 'Admin';
            mockRepository.getByTypeName.mockRejectedValue(new Error('Database error'));

            await expect(service.getAccTypeByTypeName(accTypeName)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('getAccTypes', () => {
        it('should return an array of AccountTypeDTOs', async () => {
            const dtos = [new AccountTypeDTO({ id: '1', typeName: 'Admin' })];
            mockRepository.getAccTypes.mockResolvedValue(dtos);

            const result = await service.getAccTypes();
            expect(result).toEqual(dtos);
            expect(mockRepository.getAccTypes).toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException if repository fails', async () => {
            mockRepository.getAccTypes.mockRejectedValue(new Error('Database error'));

            await expect(service.getAccTypes()).rejects.toThrow(InternalServerErrorException);
        });
    });
});
