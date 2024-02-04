export type RegistrationError = {
  message: string
  errorType: 'email_exists' | 'username_exists'
}
