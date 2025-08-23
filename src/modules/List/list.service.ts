/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from '../../middlewares/error.middleware'
import { ErrorMessages } from '../../utils/errorMessage'
import { HttpStatusCode } from '../../utils/statusCodes'
import tableService from '../Table/table.service'
import {
  DeleteListRequestDto,
  GetAllListsRequestDto,
  GetOneListRequestDto,
  PostListRequestDto,
  UpdateListRequestDto,
} from './dto/list.request.dto'
import { ListResponseDto } from './dto/list.response.dto'
import listRepositoryInstance from './list.repository'
import { IList } from './types/list.interface'

async function getAllLists(body: GetAllListsRequestDto, tableId: number): Promise<ListResponseDto[]> {
  try {
    await tableService.getUserTable(tableId, body.userId)
    const lists: IList[] = await listRepositoryInstance.getAllListsFormTable(tableId)
    return lists
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function getOneList(body: GetOneListRequestDto, tableId: number, listId: number): Promise<ListResponseDto> {
  try {
    await tableService.getUserTable(tableId, body.userId)
    const list: IList = await listRepositoryInstance.geListFromTableById(tableId, listId)
    return list
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function addOneList(body: PostListRequestDto, tableId: number): Promise<ListResponseDto> {
  try {
    await tableService.getUserTable(tableId, body.userId)
    const list: IList = await listRepositoryInstance.addNewList(tableId, body.name)
    return list
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function updateList(body: UpdateListRequestDto, tableId: number, listId: number): Promise<ListResponseDto> {
  try {
    await tableService.getUserTable(tableId, body.userId)
    const list: IList = await listRepositoryInstance.updateList(tableId, body.name, listId)
    return list
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function deleteList(body: DeleteListRequestDto, tableId: number, listId: number): Promise<void> {
  try {
    await tableService.getUserTable(tableId, body.userId)
    await listRepositoryInstance.deleteList(tableId, listId)
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

export default { getAllLists, getOneList, addOneList, updateList, deleteList }
