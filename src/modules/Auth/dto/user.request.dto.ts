import { IUser } from '../user'
export interface LoginRequestDto extends Pick<IUser, 'username'> {
  password: string
}

export interface RegisterRequestDto extends Omit<IUser, 'passwordhash'> {
  password: string
  repeatedPassword: string
}
