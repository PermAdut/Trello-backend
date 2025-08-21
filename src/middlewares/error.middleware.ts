import { NextFunction, Request, Response } from 'express'
import { HttpStatusCode } from '../utils/statusCodes'
import { ErrorMessages } from '../utils/errorMessage'

export class AppError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    error: err.message || ErrorMessages.INTERNAL_SERVER_ERROR,
  })
}
