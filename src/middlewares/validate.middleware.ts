import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { HttpStatusCode } from '../utils/statusCodes'

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({
        error: errors
          .array()
          .map((el) => el.msg)
          .join('; '),
      })
    }
    next()
  } catch (err) {
    next(err)
  }
}
