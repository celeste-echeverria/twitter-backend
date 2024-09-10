import { Follow, PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO, UserViewWithFollowStatusDTO } from '../dto'
import { UserRepository } from './user.repository'
import { SignupInputDTO } from '@domains/auth/dto'
import { profile } from 'console'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: SignupInputDTO): Promise<UserDTO> {
    const user = await this.db.user.create({
      data
    })
    return new UserDTO(user);
  }

  async getById (userId: any): Promise<UserDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
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

  async getRecommendedUsersPaginated (recommendedUsersIds: string[], options: OffsetPagination): Promise<UserViewDTO[]> {
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
    return users.map(user => new UserViewDTO(user))
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
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async setPrivacy (userId: any, privacy: boolean): Promise<UserDTO>{
    const updatedUser = await this.db.user.update({
      where: {
        id : userId
      },
      data: {
        privacy : privacy
      }
    })
    return new UserDTO({...updatedUser, privacy})
  }

  async getPublicUsersIds(): Promise <string[]>{
    const users = await this.db.user.findMany({
      where: {
        privacy: false
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
  
  async getExtendedViewById (userId: any): Promise<UserViewWithFollowStatusDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
    })
    return user ? new UserViewWithFollowStatusDTO({...user, followedByActiveUser: false}) : null
  }

  async getViewById (userId: any): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
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
      },
    })

    return users.length ? users.map(user => new UserViewDTO(user)) : []
  }

  async getUserWithFollowers(userId: string): Promise<UserViewDTO | null>{
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
      include: {
        followers: true,
        following: true
      }
    })
    return user ? new UserViewDTO(user) : null
  }
}


