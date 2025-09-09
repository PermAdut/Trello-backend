import { NextFunction, Request, Response } from 'express'
import { TaskParamType } from './dto/task.request.param'
import { TaskResponseDto } from './dto/task.response.dto'
import {
  DeleteTaskRequestDto,
  GetAllTasksRequestDto,
  GetOneTaskRequestDto,
  MoveTaskRequestDto,
  PostTaskRequestDto,
  UpdateTaskRequestDto,
} from './dto/task.request.dto'
import taskService from './task.service'
import { HttpStatusCode } from '../../utils/statusCodes'

async function getAll(
  req: Request<Omit<TaskParamType, 'taskId'>, TaskResponseDto[], GetAllTasksRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const tasks = await taskService.getAllTasks(req.body, req.params)
    res.status(HttpStatusCode.OK).json(tasks)
  } catch (err) {
    next(err)
  }
}

async function getOne(
  req: Request<TaskParamType, TaskResponseDto, GetOneTaskRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const task = await taskService.getTaskById(req.body, req.params)
    res.status(HttpStatusCode.OK).json(task)
  } catch (err) {
    next(err)
  }
}

async function addOne(
  req: Request<Omit<TaskParamType, 'taskId'>, TaskResponseDto, PostTaskRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const task = await taskService.addNewTask(req.body, req.params)
    res.status(HttpStatusCode.CREATED).json(task)
  } catch (err) {
    next(err)
  }
}

async function updateOne(
  req: Request<TaskParamType, TaskResponseDto, UpdateTaskRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const task = await taskService.updateTask(req.body, req.params)
    res.status(HttpStatusCode.OK).json(task)
  } catch (err) {
    next(err)
  }
}

async function deleteOne(
  req: Request<TaskParamType, TaskResponseDto, DeleteTaskRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    await taskService.deleteTask(req.body, req.params)
    res.status(HttpStatusCode.NO_CONTENT).json()
  } catch (err) {
    next(err)
  }
}

async function moveOne(
  req: Request<Pick<TaskParamType, 'tableId'>, TaskResponseDto[], MoveTaskRequestDto, null>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await taskService.moveTasksInLists(req.body, req.params)
    res.status(HttpStatusCode.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export default { getAll, getOne, addOne, updateOne, deleteOne, moveOne }
