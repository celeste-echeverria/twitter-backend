import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@utils/errors'
import {
  checkPassword,
  encryptPassword,
  generateAccessToken,
} from '@utils/auth'

import { LoginInputDTO, SignupInputDTO, TokenDTO } from '../dto'
import { AuthService } from './auth.service'
import { UserService, UserServiceImpl } from '@domains/user/service'

export class AuthServiceImpl implements AuthService {
  constructor (
    private readonly userService: UserService = new UserServiceImpl(), 
  ) {}

  async signup (data: SignupInputDTO): Promise<TokenDTO> {
    
    try {

      let existingUser
      try{
        existingUser = await this.userService.getUserByEmailOrUsername(data.email, data.username)
      } catch (error) {
        if (error instanceof NotFoundException) existingUser = null  
      }
      
      if (existingUser) throw new ConflictException('USER_ALREADY_EXISTS')

      const encryptedPassword = await encryptPassword(data.password)
      const user = await this.userService.createUser({ ...data, password: encryptedPassword })
      const token = generateAccessToken({ userId: user.id })
      return { token }

    } catch (error) {
      console.log('error in auth:', error)

      if (error instanceof NotFoundException) throw error
      if (error instanceof ConflictException) throw error
      throw new InternalServerErrorException("signup")
    }
  }

  async login (data: LoginInputDTO): Promise<TokenDTO> {
    try{
      const user = await this.userService.getUserByEmailOrUsername(data.email, data.username)

      const isCorrectPassword = await checkPassword(data.password, user.password)
      if (!isCorrectPassword) throw new UnauthorizedException('Invalid credentials')

      const token = generateAccessToken({ userId: user.id })
      return { token }
    } catch (error) {
      console.log('error in auth:', error)
      if (error instanceof NotFoundException) throw new UnauthorizedException("Invalid credentials")
      if (error instanceof UnauthorizedException) throw error
      throw new InternalServerErrorException("login")
    }
  }
}
