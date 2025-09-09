import { ITable } from '../types/table.interface'
export interface GetTableRequestDto extends Pick<ITable, 'userId'> {}
export interface PostTableRequestDto extends Omit<ITable, 'id'> {}
export interface UpdateTableRequestDto extends Omit<ITable, 'id'> {}
export interface DeleteTableRequestDto extends Pick<ITable, 'userId'> {}
