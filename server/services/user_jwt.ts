import jwt from 'jsonwebtoken'
import { env } from '../../config/env.config'
import { IUser } from '../../types/user.type'
const SECRET_KEY = env.USER_JWT_SECRET

export const generateUserJWTToken = (data: IUser) => {
  if (SECRET_KEY) {
    return jwt.sign(data, SECRET_KEY, {
      expiresIn: '2 days'
    })
  } else {
    throw new Error('User JWT key not found.')
  }
}

export const verifyUserToken = (token: string) => {
  if (SECRET_KEY) {
    return jwt.verify(token, SECRET_KEY)
  } else {
    throw new Error('JWT key not found.')
  }
}

export const decodeUserToken = (token: string) => {
  return jwt.decode(token)
}

export const generateResetUserEmailJWTToken = (email: string) => {
  if (SECRET_KEY) {
    return jwt.sign({ email }, SECRET_KEY, {
      expiresIn: '1h'
    })
  } else {
    throw new Error('User JWT key not found.')
  }
}

export const verifyResetUserEmailToken = (token: string) => {
  if (SECRET_KEY) {
    return jwt.verify(token, SECRET_KEY)
  } else {
    throw new Error('JWT key not found.')
  }
}

export const decodeResetUserEmailToken = (token: string) => {
  return jwt.decode(token)
}
