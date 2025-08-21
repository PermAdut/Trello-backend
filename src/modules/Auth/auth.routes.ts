import { Router } from 'express'
import authController from './auth.controller'

const authRouter = Router()
authRouter.post('/login', authController.login)
authRouter.post('/register', authController.register)
authRouter.post('/refresh', authController.refresh)

export default authRouter
