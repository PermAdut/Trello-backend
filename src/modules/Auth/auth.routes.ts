import { Router } from 'express'
import authController from './auth.controller'
import { body } from 'express-validator'
import validateMiddleware from '../../middlewares/validate.middleware'
const authRouter = Router()
authRouter.post(
  '/login',
  [
    body('username')
      .isString()
      .withMessage('Username must be a string')
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage('Username must be between 5 and 20 characters'),
    body('password')
      .isString()
      .withMessage('Password must be a string')
      .isLength({ min: 6, max: 50 })
      .withMessage('Password must be between 6 and 50 characters'),
  ],
  validateMiddleware,
  authController.login,
)
authRouter.post(
  '/register',
  [
    body('username')
      .isString()
      .withMessage('Username must be a string')
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage('Username must be between 5 and 20 characters')
      .matches(/^[a-zA-Z0-9_]{5,20}$/)
      .withMessage('Username can only contain Latin letters, digits, and underscores'),
    body('email')
      .isEmail()
      .withMessage('Email must be valid')
      .isLength({ min: 10, max: 30 })
      .withMessage('Email must be between 10 and 30 characters')
      .normalizeEmail(),
    body('firstName')
      .isString()
      .withMessage('First name must be a string')
      .trim()
      .isLength({ min: 2, max: 20 })
      .withMessage('First name must be between 5 and 20 characters')
      .matches(/^[a-zA-Z]{2,20}$/)
      .withMessage('First name can only contain Latin letters'),
    body('password')
      .isString()
      .withMessage('Password must be a string')
      .isLength({ min: 5, max: 30 })
      .withMessage('Password must be between 5 and 30 characters'),
    body('repeatedPassword')
      .isString()
      .withMessage('Repeated password must be a string')
      .isLength({ min: 5, max: 30 })
      .withMessage('Repeated password must be between 5 and 30 characters')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match')
        }
        return true
      }),
  ],
  validateMiddleware,
  authController.register,
)
authRouter.post('/refresh', authController.refresh)

export default authRouter
