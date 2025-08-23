import { Router } from 'express'
import { body } from 'express-validator'
import logsController from './logs.controller'
import authenticateJwt from '../../middlewares/auth.middleware'
import validateMiddleware from '../../middlewares/validate.middleware'

const logsRouter = Router()
logsRouter.route('').get(authenticateJwt, logsController.getAll)
logsRouter
  .route('')
  .post(
    [body('log').isString().withMessage('Log must be a string').trim().notEmpty().withMessage('Log cannot be empty')],
    validateMiddleware,
    authenticateJwt,
    logsController.create,
  )

export default logsRouter
