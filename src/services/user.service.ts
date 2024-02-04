import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export class UsersService {
  constructor() {}

  public async register(email: string, username: string, password: string): Promise<void> {
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

      await prisma.users.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      })
    } catch (error) {
      throw error
    }
  }

  public async login(emailOrUsername: string, password: string) {
    try {
      const user = await prisma.users.findFirst({
        where: {
          OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
        },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (passwordMatch) {
        return user
      } else {
        throw new Error('Incorrect password')
      }
    } catch (error) {
      console.log('Error in login Service')
      throw error
    }
  }
}
