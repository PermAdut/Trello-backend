import { Router } from 'express'
import { body, param } from 'express-validator'
import tableController from './table.controller'
import authenticateJwt from '../../middlewares/auth.middleware'
import validateMiddleware from '../../middlewares/validate.middleware'

const tableRouter = Router()
tableRouter.route('').get(authenticateJwt, tableController.getAll)
tableRouter
  .route('/:id')
  .get(
    [param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer').toInt()],
    validateMiddleware,
    authenticateJwt,
    tableController.getOne,
  )

tableRouter
  .route('')
  .post(
    [body('name').isString().withMessage('Table name must be a string').trim()],
    validateMiddleware,
    authenticateJwt,
    tableController.addOne,
  )

tableRouter
  .route('/:id')
  .patch(
    [
      param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer').toInt(),
      body('name').isString().withMessage('Table name must be a string').trim(),
    ],
    validateMiddleware,
    authenticateJwt,
    tableController.updateOne,
  )

tableRouter
  .route('/:id')
  .delete(
    [param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer').toInt()],
    validateMiddleware,
    authenticateJwt,
    tableController.deleteOne,
  )

export default tableRouter
