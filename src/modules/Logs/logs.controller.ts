import { NextFunction, Request, Response } from 'express'
import { LogsResponseDto } from './dto/logs.response.dto'
import { GetLogsRequestDto, PostLogsRequestDto } from './dto/logs.request.dto'
import logsService from './logs.service'
import { HttpStatusCode } from '../../utils/statusCodes'

async function getAll(
  req: Request<object, LogsResponseDto, GetLogsRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const logs = await logsService.getUserLogs(req.body.userId)
    res.status(HttpStatusCode.OK).json(logs)
  } catch (err) {
    next(err)
  }
}

async function create(
  req: Request<object, LogsResponseDto, PostLogsRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const log = await logsService.addLog(req.body)
    res.status(HttpStatusCode.CREATED).json(log)
  } catch (err) {
    next(err)
  }
}

export default { getAll, create }
