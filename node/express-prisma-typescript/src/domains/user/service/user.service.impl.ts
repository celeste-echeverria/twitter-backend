import { InternalServerErrorException, NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { ExtendedUserDTO, UserDTO, UserViewDTO, UserViewWithFollowStatusDTO } from '../dto'
import { UserRepository, UserRepositoryImpl } from '../repository'

import { UserService } from './user.service'
import { db } from '@utils/database'
import { SignupInputDTO } from '@domains/auth/dto'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'
import { getPresignedGetURL, getPresignedPutUrl } from '@utils/aws.s3'

export class UserServiceImpl implements UserService {
  constructor (
    private readonly userRepository: UserRepository = new UserRepositoryImpl(db),
    private readonly followService: FollowService = new FollowServiceImpl(),
  ) {}

  async createUser (data: SignupInputDTO): Promise<UserDTO> {
    try {
      return await this.userRepository.create(data)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("createUser")
    }
  }

  async getUserByEmailOrUsername (username?: string, email?: string): Promise<ExtendedUserDTO>{
    try {
      const user = await this.userRepository.getByEmailOrUsername(username, email)
      if (!user) throw new NotFoundException('User')
      return user
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getUserByEmailOrUsername")
    }
  }

  async getUser (userId: any): Promise<UserDTO> {
    try {
      const user = await this.userRepository.getById(userId)
      if (!user) throw new NotFoundException('User')

      return (user)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getUser")
    }
  }

  async getUserRecommendations(
    userId: any,
    options: OffsetPagination
  ): Promise<UserViewDTO[]> {
    try {
      // Obtiene los IDs de los usuarios seguidos
      const followedUserIds = await this.followService.getFollowedUsersId(userId);
      if (followedUserIds.length === 0) return [];
  
      // Obtiene los IDs de los usuarios seguidos por cada usuario seguido
      const followPromises = followedUserIds.map((followedUserId) =>
        this.followService.getFollowedUsersId(followedUserId)
      );
  
      const usersFollowedByFollowedUsers = await Promise.all(followPromises); // Paralelización
      let recommendedUserIds = usersFollowedByFollowedUsers.flat();
  
      // Elimina duplicados y filtra usuarios que ya sigo o mi propio ID
      recommendedUserIds = Array.from(new Set(recommendedUserIds))
      .filter(
        (recommendedUserId) =>
          recommendedUserId !== userId && !followedUserIds.includes(recommendedUserId) // Filtrar aquellos que ya sigo
      );
  
      let users = await this.userRepository.getRecommendedUsersPaginated(
        recommendedUserIds,
        options
      );
      
      users = await Promise.all(users.map(async (user) => {
        if (user.profilePicture) {
          user.profilePicture = await getPresignedGetURL(user.profilePicture);
        }
        return user;
      }));

      return users

    } catch (error) {
      throw new InternalServerErrorException("getUserRecommendations");
    }
  }

  async deleteUser (userId: any): Promise<void> {
    try {
      await this.userRepository.delete(userId)
    } catch (error) {
      throw new InternalServerErrorException("deleteUser")
    }
  }

  async isPublic (userId: string): Promise<boolean> {
    try {
      const user = await this.getUser(userId)
      return !user.privacy
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("isPublic")
    }
  }

  async setUserPrivacy (userId: any, privacy: boolean) : Promise<UserDTO> {
    try {
      return await this.userRepository.setPrivacy(userId, privacy)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("setUserPrivacy")
    }
  }

  async getPublicUsersIds (): Promise <string[]> {
    try {
      return await this.userRepository.getPublicUsersIds()
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getPublicUsersIds")
    }
  }

  async getProfileUploadUrl(userId: string): Promise<string> {
    try {
      const fileName = `profiles/${userId}.jpg`; 
      const url =  await getPresignedPutUrl(fileName);
      await this.userRepository.updateProfilePicture(userId, fileName)
      console.log('saved profile picture as', fileName)
      return url 
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("getProfileUploadUrl")
    } 
  }

  async getProfileDownloadUrl(userId: string): Promise<string> {
    try {
      const fileName = await this.userRepository.getProfilePictureById(userId) 
      if (!fileName) throw new NotFoundException("Profile Picture")
      return await getPresignedGetURL(fileName);
    } catch (error) {
      console.log(error)
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getProfileDownloadUrl")
    } 
  }

  async getExtendedUserView(userId: string, otherUserId: string): Promise <UserViewWithFollowStatusDTO> {
    try {
      const user = await this.userRepository.getExtendedViewById(otherUserId)
      if (!user) throw new NotFoundException("User")

      user.followedByActiveUser = await this.followService.userIsFollowing(userId, otherUserId)
      
      if (user.profilePicture) {
        user.profilePicture = await getPresignedGetURL(user.profilePicture);
      }

      return user

    } catch (error: any) {      
      console.log(error, error.message)
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getExtendedUserView")
    }
  }

  async getUsersMatchingUsername(username: string, options?: OffsetPagination): Promise <UserViewDTO[]> {
    try {
      console.log('SEARCHING', username)
      const users = await this.userRepository.getUsersMatchingUsername(username, options || {})
      const usersWithPicture = await Promise.all(users.map(async (user) => {
        if (user.profilePicture) {
          user.profilePicture = await getPresignedGetURL(user.profilePicture);
        }
        return user;
      }));
      return usersWithPicture ?? []
    } catch (error) {
      throw new InternalServerErrorException("getUsersMatchingUsername")
    }
  }

  async getUserView (userId: string, otherUserId: string): Promise<UserViewDTO | null> {
    try {
    
      const user = await this.userRepository.getViewById(otherUserId)
      if (user && user.profilePicture) {
        user.profilePicture = await getPresignedGetURL(user.profilePicture);
      }
      return user ?? null

    } catch (error: any) {      
      console.log(error, error.message)
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getUserView")
    }
  }

}


