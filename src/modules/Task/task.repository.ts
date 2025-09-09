import { ITask } from './types/task.interface'
import { QueryResult } from 'pg'
import { pool } from '../../utils/database.connection'
import { AppError } from '../../middlewares/error.middleware'
import { HttpStatusCode } from '../../utils/statusCodes'
import { ErrorMessages } from '../../utils/errorMessage'

class TaskRepository {
  async getTasksByListId(listId: number): Promise<ITask[]> {
    const queryResult: QueryResult<ITask> = await pool.query(
      'SELECT * FROM "Tasks" WHERE "listId" = $1 ORDER BY "orderIndex"',
      [listId],
    )
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

  async addTask(task: Pick<ITask, 'title' | 'orderIndex'>, listId: number): Promise<ITask> {
    const queryResult: QueryResult<ITask> = await pool.query(
      `INSERT INTO "Tasks" ("listId", title, "orderIndex") VALUES ($1, $2, $3) RETURNING id, "listId", title, description, "isCompleted", "orderIndex"`,
      [listId, task.title, task.orderIndex],
    )
    return queryResult.rows[0]
  }

  async deleteTaskById(id: number, listId: number): Promise<ITask> {
    const queryResult: QueryResult<ITask> = await pool.query(
      `DELETE FROM "Tasks" WHERE id = $1 AND "listId" = $2 RETURNING id, "listId", title, description, "isCompleted", "orderIndex"`,
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
    if (body.orderIndex !== undefined) {
      fields.push(`"orderIndex" = $${paramIndex++}`)
      values.push(body.orderIndex)
    }
    if (fields.length === 0) {
      throw new AppError(HttpStatusCode.BAD_REQUEST, ErrorMessages.NO_FIELDS_TO_UPDATE)
    }
    values.push(id)

    const queryResult: QueryResult<ITask> = await pool.query(
      `
      UPDATE "Tasks"
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, "listId", title, description, "isCompleted", "orderIndex"
    `,
      values,
    )

    if (!queryResult.rows.length) {
      throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.TASK_NOT_FOUND)
    }

    return queryResult.rows[0]
  }

  async moveTasks(newTaskOrder: ITask[], movedTask: ITask, sourceListId: number): Promise<ITask[]> {
    try {
      await pool.query('BEGIN')

      const taskIds: number[] = newTaskOrder.map((task) => task.id)
      const orderIndexes: number[] = newTaskOrder.map((_, index) => index)
      const listIds: number[] = newTaskOrder.map((task) => task.listId)

      let sourceTasks: ITask[] = []
      if (sourceListId !== movedTask.listId) {
        const sourceTasksResult: QueryResult<ITask> = await pool.query(
          `SELECT * FROM "Tasks" WHERE "listId" = $1 AND id != $2 ORDER BY "orderIndex"`,
          [sourceListId, movedTask.id],
        )
        sourceTasks = sourceTasksResult.rows
        taskIds.push(...sourceTasks.map((task) => task.id))
        orderIndexes.push(...sourceTasks.map((_, index) => index))
        listIds.push(...sourceTasks.map(() => sourceListId))
      }

      const caseStatements = taskIds
        .map((_, index) => {
          return `
        WHEN id = $${index + 1} THEN $${taskIds.length + index + 1}
      `
        })
        .join('')

      const listIdCaseStatements = taskIds
        .map((_, index) => {
          return `
        WHEN id = $${index + 1} THEN $${2 * taskIds.length + index + 1}
      `
        })
        .join('')

      const queryResult: QueryResult<ITask> = await pool.query(
        `
      UPDATE "Tasks"
      SET "orderIndex" = CASE
        ${caseStatements}
        ELSE "orderIndex"
      END,
      "listId" = CASE
        ${listIdCaseStatements}
        ELSE "listId"
      END
      WHERE id IN (${taskIds.map((_, i) => `$${i + 1}`).join(', ')})
      RETURNING id, "listId", title, description, "isCompleted", "orderIndex"
      `,
        [...taskIds, ...orderIndexes, ...listIds],
      )

      if (!queryResult.rows.some((task) => task.id === movedTask.id)) {
        throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.TASK_NOT_FOUND)
      }

      await pool.query('COMMIT')
      return queryResult.rows.sort((a, b) => {
        if (a.listId === b.listId) return a.orderIndex - b.orderIndex
        return a.listId - b.listId
      })
    } catch (error) {
      await pool.query('ROLLBACK')
      throw error instanceof AppError
        ? error
        : new AppError(HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR)
    }
  }
}

const taskRepositoryInstance = new TaskRepository()
export default taskRepositoryInstance
