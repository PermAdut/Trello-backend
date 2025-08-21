import jwt from 'jsonwebtoken'
import { AppError } from '../middlewares/error.middleware'
import { HttpStatusCode } from './statusCodes'
import { ErrorMessages } from './errorMessage'
import '../common/env'

interface JWTPayload {
  username: string
  id: number
}

async function generateAccessToken(username: string, id: number): Promise<string> {
  const payload: JWTPayload = { username, id }
  const accessToken = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '1d',
  })
  return accessToken
}

async function generateRefreshToken(username: string, id: number): Promise<string> {
  const payload: JWTPayload = { username, id }
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: '7d',
  })
  return refreshToken
}

async function verifyAccessToken(token: string): Promise<JWTPayload> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY) as JWTPayload
    return decoded
  } catch {
    throw new AppError(HttpStatusCode.UNAUTHORIZED, ErrorMessages.INVALID_OR_EXPIRED_ACCESS_TOKEN)
  }
}

async function verifyRefreshToken(token: string): Promise<JWTPayload> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY) as JWTPayload
    return decoded
  } catch {
    throw new AppError(HttpStatusCode.UNAUTHORIZED, ErrorMessages.INVALID_OR_EXPIRED_REFRESH_TOKEN)
  }
}

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}
