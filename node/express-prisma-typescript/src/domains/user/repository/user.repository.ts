import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO } from '../dto'
import { AccountTypeDTO } from '@domains/accountType/dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: any) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserDTO[]>
  getById: (userId: any) => Promise<UserDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  setAccountType: (userId: any, accTypeId: any) => Promise<UserDTO>
  getUsersIdsByAccType: (accTypeId: string) => Promise <string[]>
}
