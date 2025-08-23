import { JWTPayloadDto } from '../../../middlewares/auth.middleware'
import { ITask } from '../types/task.interface'

export interface GetAllTasksRequestDto extends Pick<JWTPayloadDto, 'userId'> {}
export interface GetOneTaskRequestDto extends Pick<JWTPayloadDto, 'userId'> {}
export interface PostTaskRequestDto extends Pick<ITask, 'title'>, Pick<JWTPayloadDto, 'userId'> {}
export interface UpdateTaskRequestDto extends Partial<Omit<ITask, 'id'>>, Pick<JWTPayloadDto, 'userId'> {}
export interface DeleteTaskRequestDto extends Pick<JWTPayloadDto, 'userId'> {}
