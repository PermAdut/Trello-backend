import { NextFunction, Request, Response } from 'express'
import { AppError } from './error.middleware'
import jwtUtil from '../utils/jwt.util'
import { HttpStatusCode } from '../utils/statusCodes'
import { ErrorMessages } from '../utils/errorMessage'

export default async function authenticateJwt(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, ErrorMessages.MISSING_OR_INVALID_AUTH_HEADER)
    }
    const token = authHeader.replace('Bearer ', '')
    const payload = await jwtUtil.verifyAccessToken(token)

    req.body = { ...req.body, userId: payload.id, username: payload.username }
    next()
  } catch (err) {
    next(err)
  }
}
