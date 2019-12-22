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

export interface IUserLoginPayload {
  email: string
  password: string
}
