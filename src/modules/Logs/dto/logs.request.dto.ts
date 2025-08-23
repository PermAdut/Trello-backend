import { ILogs } from '../types/logs.interface'

export interface GetLogsRequestDto extends Pick<ILogs, 'userId'> {}
export interface PostLogsRequestDto extends Omit<ILogs, 'id'> {}
