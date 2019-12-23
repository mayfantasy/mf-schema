export interface IUser {
  id: string
  first_name: string
  last_name: string
  email: string
  username: string
  date_of_birth: string
  password: string
  phone: string
}

export interface IUpdateUserInfoPayload {
  id: string
  first_name?: string
  last_name?: string
  email: string
  username?: string
  date_of_birth?: string
  phone?: string
}

export interface IUpdateUserPasswordPayload {
  id: string
  password: string
}

export interface ICreateUserPayload {
  first_name: string
  last_name: string
  email: string
  username: string
  date_of_birth: string
  password: string
  phone?: string
}

export interface IUserWithoutPassword {
  id: string
  first_name: string
  last_name: string
  email: string
  username: string
  date_of_birth: string
  phone: string
}

export interface IUserWithToken {
  id: string
  token: string
  first_name: string
  last_name: string
  email: string
  username: string
  date_of_birth: string
  phone: string
}

export interface IUserLoginPayload {
  email: string
  password: string
}

export interface IResetUserPasswordByCurrentPasswordPayload {
  email: string
  current_password: string
  new_password: string
}

export interface IResetUserEmailPayload {
  current_email: string
  new_email: string
}

export interface IUserLoginWithTokenPayload {
  token: string
}

export interface IUserSendRecoverEmailPayload {
  email: string
  entry_name: string
  entry_url: string
}

export interface IUserResetPasswordPayload {
  signature: string
  password: string
}
