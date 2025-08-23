import { QueryResult } from 'pg'
import { IList } from './types/list.interface'
import { pool } from '../../utils/database.connection'
import { AppError } from '../../middlewares/error.middleware'
import { HttpStatusCode } from '../../utils/statusCodes'
import { ErrorMessages } from '../../utils/errorMessage'
class ListRepository {
  async getAllListsFormTable(tableId: number): Promise<IList[]> {
    const queryResult: QueryResult<IList> = await pool.query('SELECT * FROM "Lists" WHERE "tableId" = $1', [tableId])
    return queryResult.rows
  }

  async geListFromTableById(tableId: number, id: number): Promise<IList> {
    const queryResult: QueryResult<IList> = await pool.query('SELECT * FROM "Lists" WHERE id = $1 AND "tableId" = $2', [
      id,
      tableId,
    ])
    if (!queryResult.rows.length) {
      throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.LIST_NOT_FOUND)
    }
    return queryResult.rows[0]
  }

  async addNewList(tableId: number, name: string): Promise<IList> {
    const queryResult: QueryResult<IList> = await pool.query(
      'INSERT INTO "Lists" ("tableId", name) VALUES ($1, $2) RETURNING id, "tableId", name',
      [tableId, name],
    )
    return queryResult.rows[0]
  }

  async updateList(tableId: number, name: string, id: number): Promise<IList> {
    const queryResult: QueryResult<IList> = await pool.query(
      'UPDATE "Lists" SET name = $2 WHERE id = $3 AND "tableId" = $1 RETURNING id, "tableId", name',
      [tableId, name, id],
    )
    if (!queryResult.rows.length) {
      throw new AppError(HttpStatusCode.BAD_REQUEST, ErrorMessages.FAILED_UPDATE_LIST)
    }
    return queryResult.rows[0]
  }

  async deleteList(tableId: number, id: number): Promise<IList> {
    const queryResult: QueryResult<IList> = await pool.query(
      'DELETE from "Lists" WHERE id = $2 AND "tableId" = $1 RETURNING id, "tableId", name',
      [tableId, id],
    )
    if (!queryResult.rows.length) {
      throw new AppError(HttpStatusCode.BAD_REQUEST, ErrorMessages.FAILED_DELETE_LIST)
    }
    return queryResult.rows[0]
  }
}

const listRepositoryInstance = new ListRepository()
export default listRepositoryInstance
