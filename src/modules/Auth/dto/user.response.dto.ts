import { IUser } from '../types/user.intreface'
export interface UserResponseDto extends Pick<IUser, 'username'> {
  accessToken: string
  refreshToken: string
}
