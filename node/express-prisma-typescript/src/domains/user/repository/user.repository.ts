import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: any) => Promise<void>
  getRecommendedUsersPaginated: (recommendedUsersIds: string[], options: OffsetPagination) => Promise<UserDTO[]>
  getById: (userId: any) => Promise<UserDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  setAccountType: (userId: any, accTypeId: any, accTypeName: string) => Promise<UserDTO>
  getUsersIdsByAccType: (accTypeId: string) => Promise <string[]>
  updateProfilePicture: (userId: string, fileName: string) => Promise <UserDTO> 
  getProfilePictureById: (userId: string) => Promise <string | null>
  getViewById: (userId: any) => Promise<UserViewDTO | null> 

}
