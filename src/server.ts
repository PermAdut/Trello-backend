import app from './app'
import './common/env'
import { pool } from './utils/database.connection'

pool
  .connect()
  .then(() => {
    console.log('postgres connected')
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.error('postgres connection failed', err)
  })
