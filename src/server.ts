import app from './app'
import './common/env'

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('Server running on port: ', PORT)
})
