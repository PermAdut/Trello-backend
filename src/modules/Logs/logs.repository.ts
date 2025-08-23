import { QueryResult } from 'pg'
import { ILogs } from './types/logs.interface'
import { pool } from '../../utils/database.connection'
import { PostLogsRequestDto } from './dto/logs.request.dto'

class LogsRepository {
  async getLogsByUserId(userId: number): Promise<ILogs[]> {
    const queryResult: QueryResult<ILogs> = await pool.query(
      'SELECT * FROM "Logs" WHERE "userId" = $1 ORDER BY id DESC LIMIT 20',
      [userId],
    )
    return queryResult.rows
  }

  async addLog(log: PostLogsRequestDto): Promise<ILogs> {
    const queryResult: QueryResult<ILogs> = await pool.query(
      'INSERT INTO "Logs" ("userId", log, timestamp) VALUES ($1, $2, $3) RETURNING id, "userId", log, timestamp',
      [log.userId, log.log, log.timestamp],
    )
    return queryResult.rows[0]
  }
}

const logsRepositoryInstance = new LogsRepository()
export default logsRepositoryInstance
