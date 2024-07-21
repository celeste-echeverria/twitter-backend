import { UserServiceImpl } from '@domains/user/service';
import { UserRepository } from '@domains/user/repository';
import { AccTypeService } from '@domains/accountType/services';
import { FollowService } from '@domains/follow/service';
import { InternalServerErrorException, NotFoundException } from '@utils/errors';
import { UserDTO, ExtendedUserDTO } from '@domains/user/dto';
import { SignupInputDTO } from '@domains/auth/dto'
import { mockDeep } from 'jest-mock-extended';
import { OffsetPagination } from 'types';

// Mocks
const mockUserRepository = mockDeep<UserRepository>();
const mockAccTypeService = mockDeep<AccTypeService>();
const mockFollowService = mockDeep<FollowService>();

const userService = new UserServiceImpl(mockUserRepository, mockAccTypeService, mockFollowService);

describe('UserServiceImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
        const inputDTO: SignupInputDTO = {
            email: 'exampe@gmail.com ', name: 'name', password: 'Password123.', username: 'username'
        };
        const accType = { id: 'acc-type-id', typeName: 'Public' };
        const userDTO: UserDTO = {
            accTypeId: 'accTypeId', createdAt: new Date(), id: 'id', name: 'name', profilePicture: null
        };

        mockAccTypeService.getAccTypeByTypeName.mockResolvedValue(accType);
        mockUserRepository.create.mockResolvedValue(userDTO);

        const result = await userService.createUser(inputDTO);

        expect(result).toEqual(userDTO);
        expect(mockAccTypeService.getAccTypeByTypeName).toHaveBeenCalledWith("Public");
        expect(mockUserRepository.create).toHaveBeenCalledWith({ ...inputDTO, accTypeId: accType.id });
    });

    it('should throw NotFoundException if account type not found', async () => {
        const inputDTO: SignupInputDTO = {
            email: 'exampe@gmail.com ', name: 'name', password: 'Password123.', username: 'username', accTypeName: 'other'
        };
        mockAccTypeService.getAccTypeByTypeName.mockResolvedValue(null);

        await expect(userService.createUser(inputDTO))
            .rejects.toThrow(new NotFoundException('Account Type'));
    });

    it('should throw InternalServerErrorException on repository error', async () => {
        const inputDTO: SignupInputDTO = {
            email: 'exampe@gmail.com ', name: 'name', password: 'Password123.', username: 'username', accTypeName: 'Public'
            };      const accType = { id: 'acc-type-id', typeName: 'Public' };

        mockAccTypeService.getAccTypeByTypeName.mockResolvedValue(accType);
        mockUserRepository.create.mockRejectedValue(new Error('Repository error'));

        await expect(userService.createUser(inputDTO))
            .rejects.toThrow(new InternalServerErrorException('createUser'));
    });
  });

  describe('getUserByEmailOrUsername', () => {
    it('should return user by email or username', async () => {
        const username = 'user';
        const email = 'user@example.com';
        const userDTO: ExtendedUserDTO = {
            accTypeId: 'accTypeId', email: 'example@gmail.com', username: 'username', createdAt: new Date(), id: 'id', name: 'name', accTypeName: 'Public', profilePicture: null, password: 'password'
        };

        mockUserRepository.getByEmailOrUsername.mockResolvedValue(userDTO);

        const result = await userService.getUserByEmailOrUsername(username, email);

        expect(result).toEqual(userDTO);
        expect(mockUserRepository.getByEmailOrUsername).toHaveBeenCalledWith(username, email);
    });

    it('should throw NotFoundException if user not found', async () => {
      const username = 'user';
      const email = 'user@example.com';

      mockUserRepository.getByEmailOrUsername.mockResolvedValue(null);

      await expect(userService.getUserByEmailOrUsername(username, email))
        .rejects.toThrow(new NotFoundException('User'));
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const username = 'user';
      const email = 'user@example.com';

      mockUserRepository.getByEmailOrUsername.mockRejectedValue(new Error('Repository error'));

      await expect(userService.getUserByEmailOrUsername(username, email))
        .rejects.toThrow(new InternalServerErrorException('getUserByEmailOrUsername'));
    });
  });

  describe('getUser', () => {
    it('should return user with account type name', async () => {
        const userId = 'user-id';
        const userDTO: UserDTO = {
            accTypeId: 'accTypeId', createdAt: new Date(), id: 'id', name: 'name', accTypeName: 'Public', profilePicture: null
        };
        const accType = { id: 'acc-type-id', typeName: 'Public' };

        mockUserRepository.getById.mockResolvedValue(userDTO);
        mockAccTypeService.getAccTypeById.mockResolvedValue(accType);

        const result = await userService.getUser(userId);

        expect(result).toEqual({ ...userDTO, accTypeName: accType.typeName });
        expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
        expect(mockAccTypeService.getAccTypeById).toHaveBeenCalledWith(userDTO.accTypeId);
    });

    it('should throw NotFoundException if user or account type not found', async () => {
        const userId = 'user-id';
        const userDTO: UserDTO = {
            accTypeId: 'accTypeId', createdAt: new Date(), id: 'id', name: 'name', accTypeName: 'Public', profilePicture: null
        };
        mockUserRepository.getById.mockResolvedValue(null);

        await expect(userService.getUser(userId))
            .rejects.toThrow(new NotFoundException('User'));

        mockUserRepository.getById.mockResolvedValue(userDTO);
        mockAccTypeService.getAccTypeById.mockResolvedValue(null);

        await expect(userService.getUser(userId))
            .rejects.toThrow(new NotFoundException('Account Type'));
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const userId = 'user-id';

      mockUserRepository.getById.mockRejectedValue(new Error('Repository error'));

      await expect(userService.getUser(userId))
        .rejects.toThrow(new InternalServerErrorException('getUser'));
    });
  });

  describe('getUserRecommendations', () => {
    it('should return recommended users', async () => {
      const userId = 'user-id';
      const followedUserIds = ['followed-id1', 'followed-id2'];
      const recommendedUserIds = ['recommended-id1', 'recommended-id2'];
      const options: OffsetPagination = {};
      const recommendedUsers: UserDTO[] = [];

      mockFollowService.getFollowedUsersId.mockResolvedValue(followedUserIds);
      mockFollowService.getFollowedUsersId.mockResolvedValue(recommendedUserIds);
      mockUserRepository.getRecommendedUsersPaginated.mockResolvedValue(recommendedUsers);

      const result = await userService.getUserRecommendations(userId, options);

      expect(result).toEqual(recommendedUsers);
      expect(mockFollowService.getFollowedUsersId).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.getRecommendedUsersPaginated).toHaveBeenCalledWith(recommendedUserIds, options);
    });

    it('should return empty array if no followed users', async () => {
      const userId = 'user-id';
      const options: OffsetPagination = { };

      mockFollowService.getFollowedUsersId.mockResolvedValue([]);

      const result = await userService.getUserRecommendations(userId, options);

      expect(result).toEqual([]);
      expect(mockFollowService.getFollowedUsersId).toHaveBeenCalledWith(userId);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const userId = 'user-id';
      const options: OffsetPagination = { };

      mockFollowService.getFollowedUsersId.mockRejectedValue(new Error('Repository error'));

      await expect(userService.getUserRecommendations(userId, options))
        .rejects.toThrow(new InternalServerErrorException('getUserRecommendations'));
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const userId = 'user-id';

      await userService.deleteUser(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const userId = 'user-id';

      mockUserRepository.delete.mockRejectedValue(new Error('Repository error'));

      await expect(userService.deleteUser(userId))
        .rejects.toThrow(new InternalServerErrorException('deleteUser'));
    });
  });
  
  describe('isPublic', () => {
    it('should return true if user is public', async () => {
        const userId = 'user-id';
        const userDTO: UserDTO = {
            accTypeId: 'public-acc-type-id', createdAt: new Date(), id: userId, name: 'name', profilePicture: null
        };      
        const accType = { id: 'public-acc-type-id', typeName: 'Public' };

        mockAccTypeService.getAccTypeById.mockResolvedValue(accType)
        mockAccTypeService.getAccTypeByTypeName.mockResolvedValue(accType);
        mockUserRepository.getById.mockResolvedValue(userDTO);

        const result = await userService.isPublic(userId);

        expect(result).toBe(true);
        expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
        expect(mockAccTypeService.getAccTypeByTypeName).toHaveBeenCalledWith('Public');
    });

    it('should return false if user is not public', async () => {
        const userId = 'user-id';
        const userDTO: UserDTO = {
            accTypeId: 'private-acc-type-id', createdAt: new Date(), id: 'id', name: 'name', profilePicture: null
        };
        const privateAccType = { id: 'private-acc-type-id', typeName: 'Private' };
        const publicAccType =  {id: 'public-acc-type-id', typeName: 'Public' };

        mockAccTypeService.getAccTypeById.mockResolvedValue(privateAccType);
        mockAccTypeService.getAccTypeByTypeName.mockResolvedValue(publicAccType);
        mockUserRepository.getById.mockResolvedValue(userDTO);

        const result = await userService.isPublic(userId);

        expect(result).toBe(false);
        expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
        expect(mockAccTypeService.getAccTypeByTypeName).toHaveBeenCalledWith('Public');
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'user-id';

      mockUserRepository.getById.mockResolvedValue(null);

      await expect(userService.isPublic(userId))
        .rejects.toThrow(new NotFoundException('User'));
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const userId = 'user-id';

      mockUserRepository.getById.mockRejectedValue(new Error('Repository error'));

      await expect(userService.isPublic(userId))
        .rejects.toThrow(new InternalServerErrorException('isPublic'));
    });
  });

  describe('setUserAccountType', () => {
    it('should set the account type of a user successfully', async () => {
      const userId = 'user-id';
      const accTypeId = 'acc-type-id';
      const accTypeName = 'Public';

      mockAccTypeService.getAccTypeById.mockResolvedValue({ id: accTypeId, typeName: accTypeName });
      mockUserRepository.setAccountType.mockResolvedValue({ id: userId, accTypeId, accTypeName } as any);

      const result = await userService.setUserAccountType(userId, accTypeId);

      expect(result).toEqual({ id: userId, accTypeId, accTypeName });
      expect(mockAccTypeService.getAccTypeById).toHaveBeenCalledWith(accTypeId);
      expect(mockUserRepository.setAccountType).toHaveBeenCalledWith(userId, accTypeId, accTypeName);
    });

    it('should throw NotFoundException if account type does not exist', async () => {
      const userId = 'user-id';
      const accTypeId = 'acc-type-id';

      mockAccTypeService.getAccTypeById.mockResolvedValue(null);

      await expect(userService.setUserAccountType(userId, accTypeId))
        .rejects.toThrow(new NotFoundException('Account Type'));
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const userId = 'user-id';
      const accTypeId = 'acc-type-id';
      
      mockAccTypeService.getAccTypeById.mockResolvedValue({ id: accTypeId, typeName: 'Public' });
      mockUserRepository.setAccountType.mockRejectedValue(new Error('Repository error'));

      await expect(userService.setUserAccountType(userId, accTypeId))
        .rejects.toThrow(new InternalServerErrorException('setUserAccountType'));
    });
  });

  describe('getPublicUsersIds', () => {
    it('should return a list of public user IDs', async () => {
      const publicAccTypeId = 'public-acc-type-id';
      const userIds = ['user-id1', 'user-id2'];

      mockAccTypeService.getAccTypeByTypeName.mockResolvedValue({ id: publicAccTypeId, typeName: 'Public' });
      mockUserRepository.getUsersIdsByAccType.mockResolvedValue(userIds);

      const result = await userService.getPublicUsersIds();

      expect(result).toEqual(userIds);
      expect(mockAccTypeService.getAccTypeByTypeName).toHaveBeenCalledWith('Public');
      expect(mockUserRepository.getUsersIdsByAccType).toHaveBeenCalledWith(publicAccTypeId);
    });

    it('should throw NotFoundException if account type does not exist', async () => {
      mockAccTypeService.getAccTypeByTypeName.mockResolvedValue(null);

      await expect(userService.getPublicUsersIds())
        .rejects.toThrow(new NotFoundException('Account Type'));
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      mockAccTypeService.getAccTypeByTypeName.mockResolvedValue({ id: 'public-acc-type-id', typeName: 'Public' });
      mockUserRepository.getUsersIdsByAccType.mockRejectedValue(new Error('Repository error'));

      await expect(userService.getPublicUsersIds())
        .rejects.toThrow(new InternalServerErrorException('getPublicUsersIds'));
    });
  });


});
