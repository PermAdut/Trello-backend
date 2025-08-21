import { IUser } from '../user'
export interface UserResponseDto extends Pick<IUser, 'username'> {
  accessToken: string
  refreshToken: string
}
