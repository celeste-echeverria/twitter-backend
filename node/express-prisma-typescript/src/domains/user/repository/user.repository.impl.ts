import { PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'
import { contains } from 'class-validator'

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
        accType: true,
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

  async getRecommendedUsersPaginated (recommendedUsersIds: string[], options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.db.user.findMany({
      where: {id: {in: recommendedUsersIds}},
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

  async updateProfilePicture(userId: string, fileName: string): Promise <UserDTO> {
    const updatedUser = await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        profilePicture: fileName
      }
    })
    return new UserDTO(updatedUser)
  }

  async getProfilePictureById (userId: string): Promise <string | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user ? user.profilePicture : null
  }
  
  async getViewById (userId: any): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user ? new UserViewDTO(user) : null
  }

  async getUsersMatchingUsername(username: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      where: {
        username: {
          contains: username
        }
      },
      orderBy: {
        username: 'asc'
      }
    })
    return users ? users.map(user => new UserViewDTO(user)) : []
  }

}
