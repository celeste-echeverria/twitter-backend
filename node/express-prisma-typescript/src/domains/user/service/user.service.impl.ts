import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { ExtendedUserDTO, UserDTO } from '../dto'
import { UserRepository, UserRepositoryImpl } from '../repository'

import { UserService } from './user.service'
import { db } from '@utils/database'
import { AccTypeService } from '@domains/accountType/services'
import { AccTypeServiceImpl } from '@domains/accountType/services/accType.service.impl'
import { SignupInputDTO } from '@domains/auth/dto'

export class UserServiceImpl implements UserService {
  constructor (
    private readonly userRepository: UserRepository = new UserRepositoryImpl(db),
    private readonly accTypeService: AccTypeService = new AccTypeServiceImpl()
  ) {}

  async createUser (data: SignupInputDTO): Promise<UserDTO> {
    //get Public account type
    const accType = await this.accTypeService.getAccTypeByTypeName('Public')
    if(!accType) throw new NotFoundException('Account Type')

    const userData = {
      ...data,
      accTypeId: accType.id,
    };

    const user = await this.userRepository.create(userData)

    return user
  }

  async getUserByEmailOrUsername (username?: string, email?: string): Promise<ExtendedUserDTO>{
    const user = await this.userRepository.getByEmailOrUsername(username, email)
    if (!user) throw new NotFoundException('User')

    return user
  }

  async getUser (userId: any): Promise<UserDTO> {
    const user = await this.userRepository.getById(userId)
    if (!user) throw new NotFoundException('User')
    
    const accType = await this.accTypeService.getAccTypeByTypeName('Public')
    if(!accType) throw new NotFoundException('Account Type')

    return ({...user, accTypeName: accType.typeName})
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return await this.userRepository.getRecommendedUsersPaginated(options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.userRepository.delete(userId)
  }

  async isPublic (userId: any): Promise<boolean> {
    const user = await this.getUser(userId)
    if (!user) throw new NotFoundException('User')
    
    const accType = await this.accTypeService.getAccTypeByTypeName('Public')
    if (!accType) throw new NotFoundException('Account Type')

    return user.accTypeName == accType.typeName
  }

  async setUserAccountType (userId: any, accTypeId: any) : Promise<UserDTO> {
    return await this.userRepository.setAccountType(userId, accTypeId)
  }

  async getPublicUsersIds (): Promise <string[]> {
    const accType = await this.accTypeService.getAccTypeByTypeName('Public')
    if (!accType) throw new NotFoundException('Account Type')

    return await this.userRepository.getUsersIdsByAccType(accType.id)
  }

}
