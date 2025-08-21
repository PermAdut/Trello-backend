import { NextFunction, Request, Response } from 'express'
import { AppError } from './error.middleware'
import jwtUtil from '../utils/jwt.util'
import { HttpStatusCode } from '../utils/statusCodes'
import { ErrorMessages } from '../utils/errorMessage'

export interface AuthRequest extends Request {
  user?: { id: number }
}

export async function authenticateJwt(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, ErrorMessages.MISSING_OR_INVALID_AUTH_HEADER)
    }
    const token = authHeader.replace('Bearer ', '')
    const payload = await jwtUtil.verifyAccessToken(token)

    req.user = { id: payload.id }
    next()
  } catch (err) {
    next(err)
  }
}
