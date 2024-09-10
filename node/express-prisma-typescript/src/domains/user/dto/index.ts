import { FollowDTO } from "@domains/follow/dto"
import { Follow } from "@prisma/client"

export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.privacy = user.privacy
    this.profilePicture = user.profilePicture
    this.createdAt = user.createdAt
  }

  id: string
  name: string | null
  privacy: boolean
  profilePicture?: string | null
  createdAt: Date
}

export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.name = user.name
    this.password = user.password
  }

  email!: string
  username!: string
  password!: string
}

export class UserViewDTO {
  constructor (user: UserViewDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
  }

  id: string
  name: string | null
  username: string
  profilePicture: string | null
}

export class UserViewWithFollowStatusDTO {
  constructor (user: UserViewWithFollowStatusDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
    this.privacy = user.privacy
    this.followedByActiveUser = user.followedByActiveUser
  }

  id: string
  name: string | null
  username: string
  profilePicture: string | null
  privacy: boolean
  followedByActiveUser: boolean
}
