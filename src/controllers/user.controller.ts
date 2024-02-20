import { Request, Response } from 'express'
import { UsersService } from '../services/user.service'
import { AuthorizationError, RegistrationError } from '../types'

export class UsersController {
  private readonly usersService: UsersService

  constructor() {
    this.usersService = new UsersService()
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email_or_username, password } = req.body
      const user = await this.usersService.login(email_or_username, password)

      const response = {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      }

      return res.status(200).send({
        user: response,
        error: null,
        message: 'Successful authorization',
      })
    } catch (error: unknown) {
      const customError = error as AuthorizationError

      if (customError.errorType === 'wrong_auth_data') {
        return res.status(400).json({ error: customError.errorType, message: customError.message })
      } else {
        return res.status(400).json({ error: 'unexpected_error', message: 'Unexpected error' })
      }
    }
  }

  async registerUser(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body
      await this.usersService.register(email, username, password)
      return res.status(201).send({
        error: null,
        message: 'User successfully registered',
      })
    } catch (error: unknown) {
      const customError = error as RegistrationError

      if (customError.errorType === 'email_exists' || customError.errorType === 'username_exists') {
        return res.status(400).json({ error: customError.errorType, message: customError.message })
      } else {
        return res.status(400).json({ error: 'unexpected_error', message: 'Unexpected error' })
      }
    }
  }
}
