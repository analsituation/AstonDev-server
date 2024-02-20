import express, { NextFunction, Request, Response } from 'express'

import { UsersController } from '../controllers/user.controller'
import { loginSchema, registrationSchema } from '../validationSchemas'

function validateRegistration(req: Request, res: Response, next: NextFunction) {
  const { error } = registrationSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: 'validation_error', message: error.details[0].message })
  }
  next()
}

function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { error } = loginSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: 'validation_error', message: error.details[0].message })
  }
  next()
}

const route = express.Router()
const usersController = new UsersController()

route.post('/login', validateLogin, usersController.loginUser.bind(usersController))

route.post('/register', validateRegistration, usersController.registerUser.bind(usersController))

export default route
