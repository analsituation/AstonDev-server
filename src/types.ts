export type RegistrationError = {
  message: string
  errorType: 'email_exists' | 'username_exists'
}

export interface User {
  id: number
  email: string
  username: string
  password: string
  createdAt: Date
  updatedAt: Date
}
