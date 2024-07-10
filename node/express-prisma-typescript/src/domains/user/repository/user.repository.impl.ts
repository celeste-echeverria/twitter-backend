import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO } from '../dto'
import { UserRepository } from './user.repository'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: any): Promise<UserDTO> {
    const user = await this.db.user.create({
      data,
    })

    return new UserDTO(user)
  }

  async getById (userId: any): Promise<UserDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
      include: {
        accType: true
      }
    })
    return user ? new UserDTO(user) : null
  }

  async delete (userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId
      }
    })
  }

  async getRecommendedUsersPaginated (options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      orderBy: [
        {
          id: 'asc'
        }
      ],
    })
    return users.map(user => new UserDTO(user))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          {
            email
          },
          {
            username
          }
        ]
      },
      include: {
        accType: true
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async setAccountType (userId: any, accTypeId: any, accTypeName: string): Promise<UserDTO>{
    const updatedUser = await this.db.user.update({
      where: {
        id : userId
      },
      data: {
        accTypeId : accTypeId
      }
    })
    return new UserDTO({...updatedUser, accTypeName})
  }

  async getUsersIdsByAccType(accTypeId: string): Promise <string[]>{
    const users = await this.db.user.findMany({
      where: {
        accTypeId: accTypeId
      },
    })
    return users.map(user => user.id);
  }
}
