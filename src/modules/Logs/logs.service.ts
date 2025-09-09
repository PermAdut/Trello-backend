/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from '../../middlewares/error.middleware'
import { ErrorMessages } from '../../utils/errorMessage'
import { HttpStatusCode } from '../../utils/statusCodes'
import authRepositoryInstance from '../Auth/auth.repository'
import { PostLogsRequestDto } from './dto/logs.request.dto'
import { LogsResponseDto } from './dto/logs.response.dto'
import logsRepositoryInstance from './logs.repository'

async function getUserLogs(userId: number): Promise<LogsResponseDto[]> {
  try {
    await authRepositoryInstance.findUserById(userId)
    const logs = await logsRepositoryInstance.getLogsByUserId(userId)
    return logs
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function addLog(body: PostLogsRequestDto): Promise<LogsResponseDto> {
  try {
    await authRepositoryInstance.findUserById(body.userId)
    const log = await logsRepositoryInstance.addLog(body)
    return log
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

export default {
  getUserLogs,
  addLog,
}
