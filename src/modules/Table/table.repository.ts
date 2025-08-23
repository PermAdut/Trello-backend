import { QueryResult } from 'pg'
import { ITable } from './types/table.interface'
import { pool } from '../../utils/database.connection'
import { AppError } from '../../middlewares/error.middleware'
import { HttpStatusCode } from '../../utils/statusCodes'
import { ErrorMessages } from '../../utils/errorMessage'

class TableRepository {
  async getTablesByUserId(userId: number): Promise<ITable[]> {
    const queryResult: QueryResult<ITable> = await pool.query('SELECT * FROM "Tables" WHERE "userId" = $1', [userId])
    return queryResult.rows
  }

  async getTableById(id: number, userId: number): Promise<ITable> {
    const queryResult: QueryResult<ITable> = await pool.query(
      'SELECT * FROM "Tables" WHERE id = $1 AND "userId" = $2',
      [id, userId],
    )
    if (!queryResult.rows.length) {
      throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.TABLE_NOT_FOUND)
    }
    return queryResult.rows[0]
  }

  async deleteTableById(id: number): Promise<ITable> {
    const queryResult: QueryResult<ITable> = await pool.query(
      `DELETE FROM "Tables" WHERE id = $1 RETURNING id, "userId", name`,
      [id],
    )
    if (!queryResult.rows.length) {
      throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.TABLE_NOT_FOUND)
    }
    return queryResult.rows[0]
  }

  async updateTable(id: number, name: string): Promise<ITable> {
    const queryResult: QueryResult<ITable> = await pool.query(
      `UPDATE "Tables" SET name = $2 WHERE id = $1 RETURNING id, "userId", name`,
      [id, name],
    )
    if (!queryResult.rows.length) {
      throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.TABLE_NOT_FOUND)
    }
    return queryResult.rows[0]
  }
}

const tableRepositoryInstance = new TableRepository()
export default tableRepositoryInstance
