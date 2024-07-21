import { AuthServiceImpl } from '@domains/auth/service/auth.service.impl';
import { SignupInputDTO, LoginInputDTO } from '@domains/auth/dto';
import { InternalServerErrorException, ConflictException, UnauthorizedException, NotFoundException } from '@utils/errors';
import * as utils from '@utils/auth';
import { jest } from '@jest/globals';
import { ExtendedUserDTO, UserDTO } from '@domains/user/dto';
import { UserService } from '@domains/user/service';

// Mockear dependencias
const mockUserService: jest.Mocked<UserService> = {
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    getUser: jest.fn(),
    getUserByEmailOrUsername:jest.fn(),
    getUserRecommendations:jest.fn(),
    isPublic: jest.fn(),
    setUserAccountType: jest.fn(),
    getPublicUsersIds: jest.fn(),
    getProfileUploadUrl: jest.fn(),
    getProfileDownloadUrl: jest.fn(),
    getUserView: jest.fn(),
    getUsersMatchingUsername: jest.fn(),
} as any;

// Crear instancia del servicio con dependencias mockeadas
const authService = new AuthServiceImpl(mockUserService as any);

describe('AuthServiceImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user and return a token', async () => {
      // Arrange
      const signupData: SignupInputDTO = {
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
      };
      const user: UserDTO = { id: 'user-id', name: 'Test User', createdAt: new Date(), accTypeId: 'id'};
      const token = 'generated-token';

      mockUserService.getUserByEmailOrUsername.mockRejectedValue(new NotFoundException());
      mockUserService.createUser.mockResolvedValue(user);
      jest.spyOn(utils, "encryptPassword").mockResolvedValue(signupData.password);
      jest.spyOn(utils, "generateAccessToken").mockReturnValue(token);

      // Act
      const result = await authService.signup(signupData);

      // Assert
      expect(result).toEqual({ token });
      expect(mockUserService.getUserByEmailOrUsername).toHaveBeenCalledWith(signupData.email, signupData.username);
      expect(mockUserService.createUser).toHaveBeenCalledWith({ ...signupData, password: signupData.password });
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      const signupData: SignupInputDTO = {
        email: 'test@example.com',
        name: 'name',
        username: 'testuser',
        password: 'password123',
      };
      const user: UserDTO = { id: 'user-id', name: 'Test User', createdAt: new Date(), accTypeId: 'id'};
      const extendedUser: ExtendedUserDTO = { 
        ...user,
        email: 'test@example.com',
        username: 'username', 
        password: 'password'}

      mockUserService.getUserByEmailOrUsername.mockResolvedValue(extendedUser);

      // Act & Assert
      await expect(authService.signup(signupData)).rejects.toThrow(ConflictException);
    });

  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      // Arrange
      const loginData: LoginInputDTO = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      const user: UserDTO = { id: 'user-id', name: 'Test User', createdAt: new Date(), accTypeId: 'id'};
      const extendedUser: ExtendedUserDTO = { 
        ...user,
        email: 'test@example.com',
        username: 'username', 
        password: 'password'}
      const token = 'generated-token';


      mockUserService.getUserByEmailOrUsername.mockResolvedValue(extendedUser);
      jest.spyOn(utils, "checkPassword").mockResolvedValue(true);
      jest.spyOn(utils, "generateAccessToken").mockReturnValue(token);

      // Act
      const result = await authService.login(loginData);

      // Assert
      expect(result).toEqual({ token });
      expect(mockUserService.getUserByEmailOrUsername).toHaveBeenCalledWith(loginData.email, loginData.username);
      expect(utils.checkPassword).toHaveBeenCalledWith(loginData.password, extendedUser.password);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      // Arrange
      const loginData: LoginInputDTO = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      const user: UserDTO = { id: 'user-id', name: 'Test User', createdAt: new Date(), accTypeId: 'id'};
      const extendedUser: ExtendedUserDTO = { 
        ...user,
        email: 'test@example.com',
        username: 'username', 
        password: 'password'}

      mockUserService.getUserByEmailOrUsername.mockResolvedValue(extendedUser);
      jest.spyOn(utils, "checkPassword").mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      // Arrange
      const loginData: LoginInputDTO = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      mockUserService.getUserByEmailOrUsername.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
