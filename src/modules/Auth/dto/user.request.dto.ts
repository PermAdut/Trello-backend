import { IUser } from '../types/user.intreface'
export interface LoginRequestDto extends Pick<IUser, 'username'> {
  password: string
}

export interface RegisterRequestDto extends Omit<IUser, 'passwordhash'> {
  password: string
  repeatedPassword: string
}

export interface UsernameRequestDto extends Pick<IUser, 'username'> {
  userId: number
}
