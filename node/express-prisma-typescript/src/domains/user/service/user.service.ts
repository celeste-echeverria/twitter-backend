import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO } from '../dto'
import { SignupInputDTO } from '@domains/auth/dto'
import { User } from '@prisma/client'

export interface UserService {
  createUser: (data: SignupInputDTO) => Promise<UserDTO>
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserDTO>
  getUserByEmailOrUsername: (username?: string, email?: string) => Promise <ExtendedUserDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
  isPublic: (userId: any) => Promise<boolean>
  setUserAccountType: (userId: any, accTypeId: any) => Promise<UserDTO>
  getPublicUsersIds: () => Promise<string[]>
  getProfileUploadUrl: (userId: string) => Promise<string> 
  getProfileDownloadUrl: (userId: string) => Promise<string> 

}
