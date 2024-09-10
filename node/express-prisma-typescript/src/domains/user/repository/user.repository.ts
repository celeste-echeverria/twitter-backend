import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO, UserViewWithFollowStatusDTO } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: any) => Promise<void>

  getRecommendedUsersPaginated: (recommendedUsersIds: string[], options: OffsetPagination) => Promise<UserViewDTO[]>

  getById: (userId: any) => Promise<UserDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>

  setPrivacy: (userId: any, privacy: boolean) => Promise<UserDTO>
  getPublicUsersIds: () => Promise <string[]>

  updateProfilePicture: (userId: string, fileName: string) => Promise <UserDTO> 
  getProfilePictureById: (userId: string) => Promise <string | null>

  getExtendedViewById: (userId: any) => Promise<UserViewWithFollowStatusDTO | null> 
  getViewById: (userId: any) => Promise<UserViewDTO | null> 
  getUsersMatchingUsername: (username: string, options: OffsetPagination) => Promise<UserViewDTO[]> 

}
