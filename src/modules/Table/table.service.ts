/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from '../../middlewares/error.middleware'
import { ErrorMessages } from '../../utils/errorMessage'
import { HttpStatusCode } from '../../utils/statusCodes'
import authRepositoryInstance from '../Auth/auth.repository'
import { TableResponseDto } from './dto/table.response.dto'
import tableRepositoryInstance from './table.repository'

async function getUserTables(userId: number): Promise<TableResponseDto[]> {
  try {
    await authRepositoryInstance.findUserById(userId)
    const tables = await tableRepositoryInstance.getTablesByUserId(userId)
    return tables
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function getUserTable(tableId: number, userId: number): Promise<TableResponseDto> {
  try {
    await authRepositoryInstance.findUserById(userId)
    const tables = await tableRepositoryInstance.getTableById(tableId, userId)
    return tables
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function deleteUserTable(userId: number, tableId: number): Promise<void> {
  try {
    await authRepositoryInstance.findUserById(userId)
    await tableRepositoryInstance.deleteTableById(tableId, userId)
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function updateUserTable(userId: number, tableId: number, name: string): Promise<TableResponseDto> {
  try {
    await authRepositoryInstance.findUserById(userId)
    const table = await tableRepositoryInstance.updateTable(tableId, name, userId)
    return table
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

async function addUserTable(name: string, userId: number): Promise<TableResponseDto> {
  try {
    await authRepositoryInstance.findUserById(userId)
    const table = await tableRepositoryInstance.addTable(name, userId)
    return table
  } catch (err: any) {
    throw new AppError(
      err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      err?.message || ErrorMessages.INTERNAL_SERVER_ERROR,
    )
  }
}

export default {
  getUserTables,
  getUserTable,
  addUserTable,
  deleteUserTable,
  updateUserTable,
}
