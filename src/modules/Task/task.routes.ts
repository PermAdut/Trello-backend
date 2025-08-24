import { Router } from 'express'
import { body, param } from 'express-validator'
import authenticateJwt from '../../middlewares/auth.middleware'
import validateMiddleware from '../../middlewares/validate.middleware'
import taskController from './task.controller'

const taskRouter = Router()

taskRouter
  .route('/:tableId/:listId')
  .get(
    [
      param('tableId').isInt({ min: 1 }).withMessage('Table ID must be a positive integer').toInt(),
      param('listId').isInt({ min: 1 }).withMessage('List ID must be a positive integer').toInt(),
    ],
    validateMiddleware,
    authenticateJwt,
    taskController.getAll,
  )

taskRouter
  .route('/:tableId/:listId/:taskId')
  .get(
    [
      param('tableId').isInt({ min: 1 }).withMessage('Table ID must be a positive integer').toInt(),
      param('listId').isInt({ min: 1 }).withMessage('List ID must be a positive integer').toInt(),
      param('taskId').isInt({ min: 1 }).withMessage('Task ID must be a positive integer').toInt(),
    ],
    validateMiddleware,
    authenticateJwt,
    taskController.getOne,
  )

taskRouter
  .route('/:tableId/:listId')
  .post(
    [
      param('tableId').isInt({ min: 1 }).withMessage('Table ID must be a positive integer').toInt(),
      param('listId').isInt({ min: 1 }).withMessage('List ID must be a positive integer').toInt(),
      body('title').isString().trim().notEmpty().withMessage('Title must be a non-empty string'),
      body('orderIndex').isInt().withMessage('OrderIndex must be a number'),
    ],
    validateMiddleware,
    authenticateJwt,
    taskController.addOne,
  )

taskRouter
  .route('/:tableId/:listId/:taskId')
  .delete(
    [
      param('tableId').isInt({ min: 1 }).withMessage('Table ID must be a positive integer').toInt(),
      param('listId').isInt({ min: 1 }).withMessage('List ID must be a positive integer').toInt(),
      param('taskId').isInt({ min: 1 }).withMessage('Task ID must be a positive integer').toInt(),
    ],
    validateMiddleware,
    authenticateJwt,
    taskController.deleteOne,
  )

taskRouter
  .route('/:tableId/:listId/:taskId')
  .patch(
    [
      param('tableId').isInt({ min: 1 }).withMessage('Table ID must be a positive integer').toInt(),
      param('listId').isInt({ min: 1 }).withMessage('List ID must be a positive integer').toInt(),
      param('taskId').isInt({ min: 1 }).withMessage('Task ID must be a positive integer').toInt(),
      body('listId').optional().isInt({ min: 1 }).withMessage('List ID must be a positive integer').toInt(),
      body('title').optional().isString().trim().notEmpty().withMessage('Title must be a non-empty string'),
      body('description').optional().isString().withMessage('Description must be a string'),
      body('isCompleted').optional().isBoolean().withMessage('isCompleted must be a boolean'),
    ],
    validateMiddleware,
    authenticateJwt,
    taskController.updateOne,
  )

export default taskRouter
