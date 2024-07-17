import { InternalServerErrorException, NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { ExtendedUserDTO, UserDTO } from '../dto'
import { UserRepository, UserRepositoryImpl } from '../repository'

import { UserService } from './user.service'
import { db } from '@utils/database'
import { AccTypeService } from '@domains/accountType/services'
import { AccTypeServiceImpl } from '@domains/accountType/services/accType.service.impl'
import { SignupInputDTO } from '@domains/auth/dto'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'
import { getPresignedGetURL, getPresignedPutUrl } from '@utils/aws.s3'

export class UserServiceImpl implements UserService {
  constructor (
    private readonly userRepository: UserRepository = new UserRepositoryImpl(db),
    private readonly accTypeService: AccTypeService = new AccTypeServiceImpl(),
    private readonly followService: FollowService = new FollowServiceImpl(),
  ) {}

  async createUser (data: SignupInputDTO): Promise<UserDTO> {
    try {
      //get Public account type
      const accType = await this.accTypeService.getAccTypeByTypeName(data.accTypeName)
      if(!accType) throw new NotFoundException('Account Type')

      const userData = {
        ...data,
        accTypeId: accType.id,
        accTypeName: accType.typeName
      };
      //revisar!!!!!!!
      return await this.userRepository.create(userData)

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
      const accType = await this.accTypeService.getAccTypeById(user.accTypeId)
      if (!accType) throw new NotFoundException('Account Type')

      return ({...user, accTypeName: accType.typeName})
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getUser")
    }
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserDTO[]> {
    try {
      //Gets followed users Ids
      const followedUserIds = await this.followService.getFollowedUsersId(userId)
      if (followedUserIds.length === 0) return []; 
      
      //Gets id from users followed by every followed user
      const followPromises = followedUserIds.map(followedUserId => 
        this.followService.getFollowedUsersId(followedUserId)
      );
      const usersFollowedByFollowedUsers = await Promise.all(followPromises); //Paralelizacion? revisar
      let recommendedUserIds = usersFollowedByFollowedUsers.flat();

      recommendedUserIds = Array
      .from(new Set(recommendedUserIds))    //Deletes duplicates
      .filter(recommendedUserId => recommendedUserId !== userId); //filters out my own Id

      return await this.userRepository.getRecommendedUsersPaginated(recommendedUserIds, options);
    
    } catch (error) {
      throw new InternalServerErrorException("getUserRecommendations")
    }
    
  }

  async deleteUser (userId: any): Promise<void> {
    try {
      await this.userRepository.delete(userId)
    } catch (error) {
      throw new InternalServerErrorException("deleteUser")
    }
  }

  async isPublic (userId: any): Promise<boolean> {
    try {
      const user = await this.getUser(userId)
      if (!user) throw new NotFoundException('User')
      
      const accType = await this.accTypeService.getAccTypeByTypeName('Public')
      if (!accType) throw new NotFoundException('Account Type')

      return user.accTypeId == accType.id
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("isPublic")
    }
  }

  async setUserAccountType (userId: any, accTypeId: any) : Promise<UserDTO> {
    try {
      const accType = await this.accTypeService.getAccTypeById(accTypeId)
      return await this.userRepository.setAccountType(userId, accTypeId, accType.typeName)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("setUserAccountType")
    }
  }

  async getPublicUsersIds (): Promise <string[]> {
    try {
      const accType = await this.accTypeService.getAccTypeByTypeName('Public')
      if (!accType) throw new NotFoundException('Account Type')
      return await this.userRepository.getUsersIdsByAccType(accType.id)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getPublicUsersIds")
    }
  }

  async getProfileUploadUrl(userId: string): Promise<string> {
    try {
      const fileName = `profiles/${userId}.jpg`; //revisar nombre
      return await getPresignedPutUrl(fileName);
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("getProfileUploadUrl")
    } 
  }

  async getProfileDownloadUrl(userId: string): Promise<string> {
    try {
      const fileName = `profiles/${userId}.jpg`; //revisar nombre
      return await getPresignedGetURL(fileName);
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("getProfileDownloadUrl")
    } 
  }
}
