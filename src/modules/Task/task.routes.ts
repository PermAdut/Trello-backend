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

taskRouter.route('/:tableId').post(
  [
    param('tableId').isInt({ min: 1 }).withMessage('Table ID must be a positive integer').toInt(),
    body('sourceListId').isInt({ min: 1 }).withMessage('Source List ID must be a positive integer'),

    body('movedTask').isObject().withMessage('Moved task must be an object'),
    body('movedTask.id').isInt({ min: 1 }).withMessage('Moved task ID must be a positive integer'),
    body('movedTask.listId').isInt({ min: 1 }).withMessage('Moved task List ID must be a positive integer'),
    body('movedTask.title').isString().notEmpty().trim().withMessage('Moved task title must be a non-empty string'),
    //   body('movedTask.description')
    //     .optional()
    //     .isString()
    //     .withMessage('Moved task description must be a string or null'),
    body('movedTask.isCompleted').isBoolean().withMessage('Moved task isCompleted must be a boolean'),
    body('movedTask.orderIndex').isInt({ min: 0 }).withMessage('Moved task orderIndex must be a non-negative integer'),

    body('tasks').isArray({ min: 0 }).withMessage('Tasks must be an array'),
    body('tasks.*.id').isInt({ min: 1 }).withMessage('Task ID must be a positive integer'),
    body('tasks.*.listId').isInt({ min: 1 }).withMessage('Task List ID must be a positive integer'),
    body('tasks.*.title').isString().notEmpty().trim().withMessage('Task title must be a non-empty string'),
    //   body('tasks.*.description').optional().isString().withMessage('Task description must be a string or null'),
    body('tasks.*.isCompleted').isBoolean().withMessage('Task isCompleted must be a boolean'),
    body('tasks.*.orderIndex').isInt({ min: 0 }).withMessage('Task orderIndex must be a non-negative integer'),
  ],
  validateMiddleware,
  authenticateJwt,
  taskController.moveOne,
)
export default taskRouter
