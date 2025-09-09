import { NextFunction, Request, Response } from 'express'
import { LoginRequestDto, RegisterRequestDto, UsernameRequestDto } from './dto/user.request.dto'
import { UsernameResponseDto, UserResponseDto } from './dto/user.response.dto'
import authService from './auth.service'
import { HttpStatusCode } from '../../utils/statusCodes'

async function register(
  req: Request<object, UserResponseDto, RegisterRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await authService.registerNewUser(req.body)
    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.status(HttpStatusCode.CREATED).json({ username: user.username, accessToken: user.accessToken })
  } catch (err) {
    next(err)
  }
}

async function login(req: Request<object, UserResponseDto, LoginRequestDto, null>, res: Response, next: NextFunction) {
  try {
    const user = await authService.loginUser(req.body)
    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.status(HttpStatusCode.OK).json({ username: user.username, accessToken: user.accessToken })
  } catch (err) {
    next(err)
  }
}

async function refresh(req: Request<object, null, null, null>, res: Response, next: NextFunction) {
  try {
    const refreshToken: string | undefined = req.cookies.refreshToken as string | undefined
    const user = await authService.generateNewAccessToken(refreshToken)
    res.status(HttpStatusCode.OK).json(user)
  } catch (err) {
    next(err)
  }
}

async function getUserName(
  req: Request<object, UsernameResponseDto, UsernameRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const username = await authService.findUserName(req.body)
    res.status(HttpStatusCode.OK).json(username)
  } catch (err) {
    next(err)
  }
}

export default {
  register,
  login,
  refresh,
  getUserName,
}
