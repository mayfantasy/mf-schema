import { ICreateUserPayload } from '../../types/user.type'
import User from '../db/models/user.model'

export const createUser = async (user: ICreateUserPayload) => {
  const newUser = new User(user)
  const result = await newUser.save()
  return result
}

export const getUserList = async () => {
  const result = await User.findAll()
  return result
}

export const deleteUser = async (id: number) => {
  const result = await User.destroy({
    where: {
      id
    }
  })
  return { id }
}
