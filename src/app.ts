import express, { Application } from 'express'
import cors from 'cors'
import './common/env'
import errorHandler from './middlewares/error.middleware'
import cookieParser from 'cookie-parser'
import authRouter from './modules/Auth/auth.routes'

const corsOptions = {
  origin: process.env.ORIGINS,
  methods: 'GET,POST,PUT,DELETE,PATCH',
  allowedHeaders: 'Content-Type,Authorization,Bearer',
  credentials: true,
}

const app: Application = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(authRouter)
app.use(errorHandler)

export default app
