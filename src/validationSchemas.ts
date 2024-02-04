import Joi from 'joi'

export const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
})

export const loginSchema = Joi.object({
  email_or_username: Joi.alternatives().try(Joi.string().email().required(), Joi.string().required()),
  password: Joi.string().min(6).required(),
})
