import { Router } from 'express'
import { body, param } from 'express-validator'
import listController from './list.controller'
import authenticateJwt from '../../middlewares/auth.middleware'
import validateMiddleware from '../../middlewares/validate.middleware'

const listRouter = Router()

listRouter
  .route('/:tableId')
  .get(
    [param('tableId').isInt({ min: 1 }).withMessage('Table ID must be a positive integer').toInt()],
    validateMiddleware,
    authenticateJwt,
    listController.getAll,
  )
listRouter
  .route('/:tableId/:listId')
  .get(
    [
      param('tableId').isInt({ min: 1 }).withMessage('Table ID must be a positive integer').toInt(),
      param('listId').isInt({ min: 1 }).withMessage('List ID must be a positive integer').toInt(),
    ],
    validateMiddleware,
    authenticateJwt,
    listController.getOne,
  )
listRouter
  .route('/:tableId')
  .post(
    [
      param('tableId').isInt({ min: 1 }).withMessage('Table ID must be a positive integer').toInt(),
      body('name')
        .isString()
        .withMessage('List name must be a string')
        .trim()
        .notEmpty()
        .withMessage('List name cannot be empty'),
    ],
    validateMiddleware,
    authenticateJwt,
    listController.addOne,
  )

listRouter
  .route('/:tableId/:listId')
  .patch(
    [
      param('tableId').isInt({ min: 1 }).withMessage('Table ID must be a positive integer').toInt(),
      param('listId').isInt({ min: 1 }).withMessage('List ID must be a positive integer').toInt(),
      body('name')
        .isString()
        .withMessage('List name must be a string')
        .trim()
        .notEmpty()
        .withMessage('List name cannot be empty'),
    ],
    validateMiddleware,
    authenticateJwt,
    listController.updateOne,
  )
listRouter
  .route('/:tableId/:listId')
  .delete(
    [
      param('tableId').isInt({ min: 1 }).withMessage('Table ID must be a positive integer').toInt(),
      param('listId').isInt({ min: 1 }).withMessage('List ID must be a positive integer').toInt(),
    ],
    validateMiddleware,
    authenticateJwt,
    listController.deleteOne,
  )

export default listRouter
