import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { User } from '../types'
import Joi from 'joi'

const prisma = new PrismaClient()

export class UsersService {
  constructor() {}

  public async register(email: string, username: string, password: string): Promise<User> {
    try {
      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      })

      if (existingUser) {
        const errorType: string = existingUser.email === email ? 'email_exists' : 'username_exists'
        throw {
          message: `${existingUser.email === email ? email : username} is already registered`,
          errorType: errorType,
        }
      }

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      const createdUser = await prisma.users.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      })

      return createdUser
    } catch (error) {
      throw error
    }
  }

  public async login(emailOrUsername: string, password: string): Promise<User> {
    try {
      const isEmail = Joi.string().email().validate(emailOrUsername).error === null
      const searchField = isEmail ? 'email' : 'username'

      const user = await prisma.users.findFirst({
        where: {
          OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
        },
      })

      if (!user) {
        throw {
          message: `Wrong ${searchField} or password`,
          errorType: 'wrong_auth_data',
        }
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (passwordMatch) {
        return user
      } else {
        // The same error for both cases. It's better to say (wrong password)
        throw {
          message: `Wrong ${searchField} or password`,
          errorType: 'wrong_auth_data',
        }
      }
    } catch (error) {
      throw error
    }
  }
}
