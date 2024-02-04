import { Request, Response } from 'express'
import { UsersService } from '../services/user.service'
import { RegistrationError } from '../types'

export class UsersController {
  private readonly usersService: UsersService

  constructor() {
    this.usersService = new UsersService()
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email_or_username, password } = req.body
      await this.usersService.login(email_or_username, password)
      return res.status(200).send('Login successful')
    } catch (error) {
      return res.status(500).send('Error occurred')
    }
  }

  async registerUser(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body
      await this.usersService.register(email, username, password)
      return res.status(201).send('Registration successful')
    } catch (error: unknown) {
      if ((error as RegistrationError).errorType === 'email_exists') {
        return res.status(400).json({ error: (error as RegistrationError).message })
      } else if ((error as RegistrationError).errorType === 'username_exists') {
        return res.status(400).json({ error: (error as RegistrationError).message })
      } else {
        console.error('Error in Register Controller:', error)
        return res.status(500).send('Error occurred')
      }
    }
  }
}
