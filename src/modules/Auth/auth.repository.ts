import { QueryResult } from 'pg'
import { IUser } from './user'
import { pool } from '../../utils/database.connection'
import { AppError } from '../../middlewares/error.middleware'
import { HttpStatusCode } from '../../utils/statusCodes'
import { ErrorMessages } from '../../utils/errorMessage'

class AuthRepository {
  async findUserByUsername(username: string): Promise<IUser> {
    const userQuery: QueryResult<IUser> = await pool.query(`SELECT * FROM "Users" WHERE username = $1`, [username])
    const findUser: IUser = userQuery.rows[0]
    if (!findUser) throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.INVALID_USERNAME)
    return findUser
  }

  async findUserById(id: number): Promise<IUser> {
    const userQuery: QueryResult<IUser> = await pool.query(`SELECT * FROM "Users" WHERE id = $1`, [id])
    const findUser: IUser = userQuery.rows[0]
    if (!findUser) throw new AppError(HttpStatusCode.NOT_FOUND, ErrorMessages.USER_NOT_FOUND)
    return findUser
  }

  async addNewUser(userData: Omit<IUser, 'id'>): Promise<IUser> {
    const insertQuery: QueryResult<IUser> = await pool.query(
      `INSERT INTO "Users" (email, username, "firstName", "passwordHash") VALUES ($1, $2, $3, $4) RETURNING id, email, username, "firstName", "passwordHash"`,
      [userData.email, userData.username, userData.firstName, userData.passwordHash],
    )
    return insertQuery.rows[0]
  }
}

const authRepositoryInstance: AuthRepository = new AuthRepository()
export default authRepositoryInstance
