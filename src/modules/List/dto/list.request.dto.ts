import { IList } from '../types/list.interface'

interface JwtPayloadId {
  userId: number
}

export interface GetAllListsRequestDto extends JwtPayloadId {}
export interface GetOneListRequestDto extends JwtPayloadId {}
export interface PostListRequestDto extends Pick<IList, 'name'>, JwtPayloadId {}
export interface UpdateListRequestDto extends Pick<IList, 'name'>, JwtPayloadId {}
export interface DeleteListRequestDto extends JwtPayloadId {}
