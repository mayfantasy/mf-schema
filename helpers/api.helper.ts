import Cors from 'micro-cors'
import { EApiMethod } from '../types/api.type'
import { NextApiRequest, NextApiResponse } from 'next'

export const cors = (methods: EApiMethod[]) =>
  Cors({
    allowMethods: methods.concat(EApiMethod.OPTIONS)
  })

export const passOptions = async (
  req: NextApiRequest,
  res: NextApiResponse,
  callback: () => any
) => {
  if (req.method === 'OPTIONS') {
    res.status(200).send('Success')
  }

  await callback()
}
