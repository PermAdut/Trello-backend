import { IUser } from '../types/user.intreface'
export interface UserResponseDto extends Pick<IUser, 'username'> {
  accessToken: string
  refreshToken: string
}

export interface UsernameResponseDto extends Pick<IUser, 'username'> {}
