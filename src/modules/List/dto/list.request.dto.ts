import { JWTPayloadDto } from '../../../middlewares/auth.middleware'
import { IList } from '../types/list.interface'

export interface GetAllListsRequestDto extends Pick<JWTPayloadDto, 'userId'> {}
export interface GetOneListRequestDto extends Pick<JWTPayloadDto, 'userId'> {}
export interface PostListRequestDto extends Pick<IList, 'name'>, Pick<JWTPayloadDto, 'userId'> {}
export interface UpdateListRequestDto extends Pick<IList, 'name'>, Pick<JWTPayloadDto, 'userId'> {}
export interface DeleteListRequestDto extends Pick<JWTPayloadDto, 'userId'> {}
