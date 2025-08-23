import { ITask } from './types/task.interface'
import { QueryResult } from 'pg'
import { pool } from '../../utils/database.connection'
import { AppError } from '../../middlewares/error.middleware'
import { HttpStatusCode } from '../../utils/statusCodes'
import { ErrorMessages } from '../../utils/errorMessage'

class TaskRepository {
  async getTasksByListId(listId: number): Promise<ITask[]> {
    const queryResult: QueryResult<ITask> = await pool.query('SELECT * FROM "Tasks" WHERE "listId" = $1', [listId])
    return queryResult.rows
  }

  async getTaskById(id: number, listId: number): Promise<ITask> {
    const queryResult: QueryResult<ITask> = await pool.query('SELECT * FROM "Tasks" WHERE id = $1 AND "listId" = $2', [
      id,
      listId,
    ])
    if (!queryResult.rows.length) {
      throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.TASK_NOT_FOUND)
    }
    return queryResult.rows[0]
  }

  async addTask(task: Omit<ITask, 'id' | 'listId' | 'isCpmpleted'>, listId: number): Promise<ITask> {
    const queryResult: QueryResult<ITask> = await pool.query(
      `INSERT INTO "Tasks" ("listId", title, description) VALUES ($1, $2, $3) RETURNING id, "listId", title, description, isCompleted`,
      [listId, task.title, task.description],
    )
    return queryResult.rows[0]
  }

  async deleteTaskById(id: number, listId: number): Promise<ITask> {
    const queryResult: QueryResult<ITask> = await pool.query(
      `DELETE FROM "Tasks" WHERE id = $1 AND "listId" = $2 RETURNING id, "listId", title, description, isCompleted`,
      [id, listId],
    )
    if (!queryResult.rows.length) {
      throw new AppError(HttpStatusCode.BAD_REQUEST, ErrorMessages.FAILED_DELETE_TASK)
    }
    return queryResult.rows[0]
  }

  async updateTask(id: number, body: Partial<Omit<ITask, 'id'>>): Promise<ITask> {
    const fields: string[] = []
    const values: (number | string | boolean)[] = []
    let paramIndex = 1

    if (body.listId !== undefined) {
      fields.push(`"listId" = $${paramIndex++}`)
      values.push(body.listId)
    }
    if (body.title !== undefined) {
      fields.push(`title = $${paramIndex++}`)
      values.push(body.title.trim())
    }
    if (body.description !== undefined) {
      fields.push(`description = $${paramIndex++}`)
      values.push(body.description.trim())
    }
    if (body.isCompleted !== undefined) {
      fields.push(`"isCompleted" = $${paramIndex++}`)
      values.push(body.isCompleted)
    }

    if (fields.length === 0) {
      throw new AppError(HttpStatusCode.BAD_REQUEST, ErrorMessages.NO_FIELDS_TO_UPDATE)
    }
    values.push(id)
    const query = `
      UPDATE "Tasks"
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, "listId", title, description, "isCompleted"
    `

    const queryResult: QueryResult<ITask> = await pool.query(query, values)

    if (!queryResult.rows.length) {
      throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.TASK_NOT_FOUND)
    }

    return queryResult.rows[0]
  }
}

const taskRepositoryInstance = new TaskRepository()
export default taskRepositoryInstance
