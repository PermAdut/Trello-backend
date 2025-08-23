import { ITable } from '../types/table.interface'

export interface UpdateTableRequestDto extends ITable {}
export interface DeleteTableRequestDto extends Omit<ITable, 'id' | 'userId'> {}
