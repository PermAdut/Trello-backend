/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt'
import jwtUtil from '../../utils/jwt.util'
import { AppError } from '../../middlewares/error.middleware'
import { ErrorMessages } from '../../utils/errorMessage'
import { HttpStatusCode } from '../../utils/statusCodes'
import { LoginRequestDto, RegisterRequestDto } from './dto/user.request.dto'
import { UserResponseDto } from './dto/user.response.dto'
import { QueryResult } from 'pg'
import { IUser } from './user'
import { pool } from '../../utils/database.connection'
import '../../common/env'

async function registerNewUser(credentials: RegisterRequestDto): Promise<UserResponseDto> {
  try {
    const hash = await bcrypt.hash(credentials.password, process.env.SALT)
    const insertQuery: QueryResult<IUser> = await pool.query(
      `INSERT INTO "Users" (email, username, "firstName", "passwordHash") VALUES ($1, $2, $3, $4)`,
      [credentials.email, credentials.username, credentials.firstName, hash],
    )
    const accessToken = await jwtUtil.generateAccessToken(insertQuery.rows[0].username, insertQuery.rows[0].id)
    const refreshToken = await jwtUtil.generateRefreshToken(insertQuery.rows[0].username, insertQuery.rows[0].id)
    return {
      username: insertQuery.rows[0].username,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }
  } catch (err: any) {
    if (err?.code === '23505') {
      throw new AppError(HttpStatusCode.CONFLICT, ErrorMessages.USERNAME_OR_EMAIL_NOT_ALLOWED)
    }
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function loginUser(credentials: LoginRequestDto): Promise<UserResponseDto> {
  try {
    const userQuery: QueryResult<IUser> = await pool.query(`SELECT * FROM "Users" WHERE username = $1`, [
      credentials.username,
    ])
    const findUser: IUser = userQuery.rows[0]
    if (!findUser) throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.INVALID_USERNAME)
    if (!(await bcrypt.compare(credentials.password, findUser.passwordHash)))
      throw new AppError(HttpStatusCode.BAD_REQUEST, ErrorMessages.INVALID_PASSWORD)
    const accessToken = await jwtUtil.generateAccessToken(findUser.username, findUser.id)
    const refreshToken = await jwtUtil.generateRefreshToken(findUser.username, findUser.id)
    return {
      username: findUser.username,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function generateNewAccessToken(refreshToken: string | undefined): Promise<string> {
  try {
    if (!refreshToken) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, ErrorMessages.REFRESH_TOKEN_NOT_PROVIDED)
    }
    const payload = await jwtUtil.verifyRefreshToken(refreshToken)
    const userQuery: QueryResult<IUser> = await pool.query(`SELECT id FROM "Users" WHERE id = $1`, [payload.id])
    if (!userQuery.rows[0]) {
      throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.USER_NOT_FOUND)
    }
    const accessToken = await jwtUtil.generateAccessToken(payload.username, payload.id)
    return accessToken
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

export default {
  registerNewUser,
  loginUser,
  generateNewAccessToken,
}
