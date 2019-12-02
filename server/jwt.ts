import jwt from 'jsonwebtoken'
import { ILoginPayload } from '../types/auth.type'
import { env } from '../config/env.config'

export const sign = (user: ILoginPayload) => {
  if (env.JWT_SECRET) {
    return jwt.sign(
      {
        data: user
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    )
  } else {
    throw new Error('JWT key not found.')
  }
}

export const varify = (token: string) => {
  if (env.JWT_SECRET) {
    return jwt.verify(token, env.JWT_SECRET)
  } else {
    throw new Error('JWT key not found.')
  }
}
