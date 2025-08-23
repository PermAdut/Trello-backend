import { NextFunction, Request, Response } from 'express'
import {
  DeleteTableRequestDto,
  GetTableRequestDto,
  PostTableRequestDto,
  UpdateTableRequestDto,
} from './dto/table.request.dto'
import { TableResponseDto } from './dto/table.response.dto'
import tableService from './table.service'
import { HttpStatusCode } from '../../utils/statusCodes'

async function getAll(
  req: Request<object, TableResponseDto[], GetTableRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const tables = await tableService.getUserTables(req.body.userId)
    res.status(HttpStatusCode.OK).json(tables)
  } catch (err) {
    next(err)
  }
}

async function getOne(
  req: Request<{ id: number }, TableResponseDto, GetTableRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const table = await tableService.getUserTable(req.params.id, req.body.userId)
    res.status(HttpStatusCode.OK).json(table)
  } catch (err) {
    next(err)
  }
}

async function addOne(
  req: Request<object, TableResponseDto, PostTableRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const table = await tableService.addUserTable(req.body.name, req.body.userId)
    res.status(HttpStatusCode.CREATED).json(table)
  } catch (err) {
    next(err)
  }
}

async function updateOne(
  req: Request<{ id: number }, TableResponseDto, UpdateTableRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const table = await tableService.updateUserTable(req.body.userId, req.params.id, req.body.name)
    res.status(HttpStatusCode.OK).json(table)
  } catch (err) {
    next(err)
  }
}

async function deleteOne(
  req: Request<{ id: number }, TableResponseDto, DeleteTableRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    await tableService.deleteUserTable(req.body.userId, req.params.id)
    res.status(HttpStatusCode.NO_CONTENT)
  } catch (err) {
    next(err)
  }
}

export default {
  getAll,
  getOne,
  addOne,
  updateOne,
  deleteOne,
}
