export type RegistrationError = {
  message: string
  errorType: 'email_exists' | 'username_exists'
}

export type AuthorizationError = {
  message: string
  errorType: 'wrong_auth_data'
}

export interface User {
  id: number
  email: string
  username: string
  password: string
  createdAt: Date
  updatedAt: Date
}
