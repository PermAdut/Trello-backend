import { NextFunction, Request, Response } from 'express'
import { ListResponseDto } from './dto/list.response.dto'
import {
  GetAllListsRequestDto,
  GetOneListRequestDto,
  PostListRequestDto,
  UpdateListRequestDto,
} from './dto/list.request.dto'
import listService from './list.service'
import { HttpStatusCode } from '../../utils/statusCodes'
import { ListParamType } from './dto/list.request.param'

async function getAll(
  req: Request<Pick<ListParamType, 'tableId'>, ListResponseDto[], GetAllListsRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const lists: ListResponseDto[] = await listService.getAllLists(req.body, req.params.tableId)
    res.status(HttpStatusCode.OK).json(lists)
  } catch (err) {
    next(err)
  }
}

async function getOne(
  req: Request<ListParamType, ListResponseDto, GetOneListRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const list: ListResponseDto = await listService.getOneList(req.body, req.params.tableId, req.params.listId)
    res.status(HttpStatusCode.OK).json(list)
  } catch (err) {
    next(err)
  }
}

async function addOne(
  req: Request<Pick<ListParamType, 'tableId'>, ListResponseDto, PostListRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const list: ListResponseDto = await listService.addOneList(req.body, req.params.tableId)
    res.status(HttpStatusCode.CREATED).json(list)
  } catch (err) {
    next(err)
  }
}

async function updateOne(
  req: Request<ListParamType, ListResponseDto, UpdateListRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const list: ListResponseDto = await listService.updateList(req.body, req.params.tableId, req.params.listId)
    res.status(HttpStatusCode.OK).json(list)
  } catch (err) {
    next(err)
  }
}

async function deleteOne(
  req: Request<ListParamType, ListResponseDto, GetOneListRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    await listService.deleteList(req.body, req.params.tableId, req.params.listId)
    res.status(HttpStatusCode.NO_CONTENT).json()
  } catch (err) {
    next(err)
  }
}
export default { getAll, getOne, addOne, updateOne, deleteOne }
