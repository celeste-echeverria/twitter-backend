import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { SignupInputDTO } from '@domains/auth/dto'
import { User } from '@prisma/client'

export interface UserService {
  createUser: (data: SignupInputDTO) => Promise<UserDTO>
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserDTO>
  getUserByEmailOrUsername: (username?: string, email?: string) => Promise <ExtendedUserDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
  isPublic: (userId: string) => Promise<boolean>
  setUserAccountType: (userId: any, accTypeId: any) => Promise<UserDTO>
  getPublicUsersIds: () => Promise<string[]>
  getProfileUploadUrl: (userId: string) => Promise<string> 
  getProfileDownloadUrl: (userId: string) => Promise<string> 
  getUserView: (userId: string, otherUserId: string) => Promise <{userview: UserViewDTO, following: string}> 
  getUsersMatchingUsername: (username: string, options: OffsetPagination) => Promise <UserViewDTO[]>

}
