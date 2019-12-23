import { query as q } from 'faunadb'
import {
  IUserLoginPayload,
  IUserLoginWithTokenPayload,
  IUserWithoutPassword,
  IResetUserPasswordByCurrentPasswordPayload,
  IResetUserEmailPayload,
  IUserSendRecoverEmailPayload
} from '../../types/user.type'
import { client } from './db/client.db'
import {
  generateUserJWTToken,
  verifyUserToken,
  generateResetUserEmailJWTToken,
  verifyResetUserEmailToken
} from './user_jwt'
import { getUserByEmail } from './user.service'
import { mailService } from './mail.service'
import { env } from '../../config/env.config'

export const loginUser = async (
  api_key: string,
  payload: IUserLoginPayload
) => {
  const clientDB = client(api_key)
  const { email, password } = payload
  const user: any = await clientDB.query(
    q.Get(q.Match(q.Index('get_user_by_email_and_password'), [email, password]))
  )

  const userData = { ...user.data }
  delete userData.password

  const token = generateUserJWTToken(userData)

  return { id: user.ref.id, token, ...userData }
}

export const loginUserWithToken = async (
  api_key: string,
  payload: IUserLoginWithTokenPayload
) => {
  const { token } = payload
  const user = verifyUserToken(token) as IUserWithoutPassword

  console.log(user)

  if (user) {
    const email = user.email
    const result = await getUserByEmail(api_key, email)
    console.log(result)

    let userData = { ...result }
    delete userData.password

    return {
      id: result.id,
      ...userData
    }
  } else {
    throw new Error('Token expired.')
  }
}

export const resetUserPasswordByCurrentPassword = async (
  api_key: string,
  payload: IResetUserPasswordByCurrentPasswordPayload
) => {
  const clientDB = client(api_key)
  const { email, current_password, new_password } = payload

  const user = await loginUser(api_key, { email, password: current_password })
  if (!new_password) {
    throw new Error(`New password missing.`)
  }

  const id = user.id

  const result: any = await clientDB.query(
    q.Update(q.Ref(q.Collection('user'), id), {
      data: { password: new_password }
    })
  )

  const userData = { ...result.data }
  delete userData.password

  return {
    id,
    ...userData
  }
}

export const resetUserEmail = async (
  api_key: string,
  payload: IResetUserEmailPayload
) => {
  const clientDB = client(api_key)
  const { current_email, new_email } = payload

  const user = await getUserByEmail(api_key, current_email)
  if (!new_email) {
    throw new Error(`New password missing.`)
  }

  const id = user.id

  const result: any = await clientDB.query(
    q.Update(q.Ref(q.Collection('user'), id), {
      data: { email: new_email }
    })
  )

  const userData = { ...result.data }
  delete userData.password

  return {
    id,
    ...userData
  }
}

export const sendRecoverEmail = async (
  api_key: string,
  payload: IUserSendRecoverEmailPayload
) => {
  const { email, entry_name, entry_url } = payload

  const RECOVER_EMAIL_ADDRESS = env.RECOVER_EMAIL_ADDRESS
  const RECOVER_EMAIL_PASSWORD = env.RECOVER_EMAIL_PASSWORD

  const recoverSignature = generateResetUserEmailJWTToken(email)

  await mailService(
    {
      service: 'hotmail',
      auth: {
        user: RECOVER_EMAIL_ADDRESS,
        pass: RECOVER_EMAIL_PASSWORD
      }
    },
    {
      from: RECOVER_EMAIL_ADDRESS,
      to: email,
      subject: `no-reply - ${entry_name} - Recover password`,
      html: `<p>Please click this link to reset your password:<br><a href="${entry_url}?signature=${recoverSignature}"><b>Reset Password</b></a>`
    }
  )

  return {
    email
  }
}

export const resetUserPassword = async (
  api_key: string,
  signature: string,
  password: string
) => {
  const clientDB = client(api_key)
  const email = (verifyResetUserEmailToken(signature) as { email: string })
    .email

  const user = await getUserByEmail(api_key, email)
  const id = user.id

  const result: any = await clientDB.query(
    q.Update(q.Ref(q.Collection('user'), id), {
      data: { password }
    })
  )

  const userData = { ...result.data }
  delete userData.password

  return {
    id,
    ...userData
  }
}
