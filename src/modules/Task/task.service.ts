/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from '../../middlewares/error.middleware'
import { ErrorMessages } from '../../utils/errorMessage'
import { HttpStatusCode } from '../../utils/statusCodes'
import listService from '../List/list.service'
import {
  DeleteTaskRequestDto,
  GetAllTasksRequestDto,
  GetOneTaskRequestDto,
  PostTaskRequestDto,
  UpdateTaskRequestDto,
} from './dto/task.request.dto'
import { TaskParamType } from './dto/task.request.param'
import { TaskResponseDto } from './dto/task.response.dto'
import taskRepositoryInstance from './task.repository'

async function getAllTasks(
  body: GetAllTasksRequestDto,
  params: Omit<TaskParamType, 'taskId'>,
): Promise<TaskResponseDto[]> {
  try {
    await listService.getOneList({ userId: body.userId }, params.tableId, params.listId)
    const tasks = await taskRepositoryInstance.getTasksByListId(params.listId)
    return tasks
  } catch (err) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function getTaskById(body: GetOneTaskRequestDto, params: TaskParamType): Promise<TaskResponseDto> {
  try {
    await listService.getOneList({ userId: body.userId }, params.tableId, params.listId)
    const task = await taskRepositoryInstance.getTaskById(params.tableId, params.listId)
    return task
  } catch (err) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function addNewTask(body: PostTaskRequestDto, params: Omit<TaskParamType, 'taskId'>): Promise<TaskResponseDto> {
  try {
    await listService.getOneList({ userId: body.userId }, params.tableId, params.listId)
    const task = await taskRepositoryInstance.addTask(body, params.listId)
    return task
  } catch (err) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function updateTask(body: UpdateTaskRequestDto, params: TaskParamType): Promise<TaskResponseDto> {
  try {
    await listService.getOneList({ userId: body.userId }, params.tableId, params.listId)
    const task = await taskRepositoryInstance.updateTask(params.taskId, body)
    return task
  } catch (err) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function deleteTask(body: DeleteTaskRequestDto, params: TaskParamType): Promise<void> {
  try {
    await listService.getOneList({ userId: body.userId }, params.tableId, params.listId)
    await taskRepositoryInstance.deleteTaskById(params.taskId, params.listId)
  } catch (err) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

export default { getAllTasks, getTaskById, addNewTask, updateTask, deleteTask }
