/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt'
import jwtUtil from '../../utils/jwt.util'
import { AppError } from '../../middlewares/error.middleware'
import { ErrorMessages } from '../../utils/errorMessage'
import { HttpStatusCode } from '../../utils/statusCodes'
import { LoginRequestDto, RegisterRequestDto } from './dto/user.request.dto'
import { UserResponseDto } from './dto/user.response.dto'
import { IUser } from './user'
import '../../common/env'
import authRepositoryInstance from './auth.repository'

async function registerNewUser(credentials: RegisterRequestDto): Promise<UserResponseDto> {
  try {
    const hash = await bcrypt.hash(credentials.password, Number(process.env.SECRET_SALT))
    const userBody = await authRepositoryInstance.addNewUser({
      username: credentials.username,
      firstName: credentials.firstName,
      email: credentials.email,
      passwordHash: hash,
    })
    const accessToken = await jwtUtil.generateAccessToken(userBody.username, userBody.id)
    const refreshToken = await jwtUtil.generateRefreshToken(userBody.username, userBody.id)
    return {
      username: userBody.username,
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
    const findUser: IUser = await authRepositoryInstance.findUserByUsername(credentials.username)
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

async function generateNewAccessToken(
  refreshToken: string | undefined,
): Promise<Omit<UserResponseDto, 'refreshToken'>> {
  try {
    if (!refreshToken) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, ErrorMessages.REFRESH_TOKEN_NOT_PROVIDED)
    }
    const payload = await jwtUtil.verifyRefreshToken(refreshToken)
    await authRepositoryInstance.findUserById(payload.id)
    const accessToken = await jwtUtil.generateAccessToken(payload.username, payload.id)
    return {
      accessToken: accessToken,
      username: payload.username,
    }
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
