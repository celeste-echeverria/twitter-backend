import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO, UserViewWithFollowStatusDTO } from '../dto'
import { SignupInputDTO } from '@domains/auth/dto'

export interface UserService {
  createUser: (data: SignupInputDTO) => Promise<UserDTO>
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserDTO>
  getUserByEmailOrUsername: (username?: string, email?: string) => Promise <ExtendedUserDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>
  isPublic: (userId: string) => Promise<boolean>
  setUserPrivacy: (userId: any, privacy: boolean) => Promise<UserDTO>
  getPublicUsersIds: () => Promise<string[]>
  getProfileUploadUrl: (userId: string) => Promise<string> 
  getProfileDownloadUrl: (userId: string) => Promise<string> 
  getExtendedUserView: (userId: string, otherUserId: string) => Promise <UserViewWithFollowStatusDTO> 
  getUserView: (userId: string, otherUserId: string) => Promise <UserViewDTO | null>
  getUsersMatchingUsername: (username: string, options?: OffsetPagination) => Promise <UserViewDTO[]>

}
