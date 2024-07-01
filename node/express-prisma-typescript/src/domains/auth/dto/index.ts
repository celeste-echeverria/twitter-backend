import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator'

export class TokenDTO {
  token!: string
}

export class SignupInputDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
    email: string

  @IsString()
  @IsNotEmpty()
    username: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
    password: string

  @IsOptional()
    accTypeId: string
    
  constructor (email: string, username: string, password: string, accTypeId: string) {
    this.email = email
    this.password = password
    this.username = username
    this.accTypeId = accTypeId
  }
}

export class LoginInputDTO {
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
    email?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
    username?: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
    password!: string
}
