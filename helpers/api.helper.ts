import Cors from 'micro-cors'
import { EApiMethod } from '../types/api.type'
import { NextApiRequest, NextApiResponse } from 'next'

export const cors = (methods: EApiMethod[]) =>
  Cors({
    allowMethods: methods.concat(EApiMethod.OPTIONS),
    origin: '*',
    allowHeaders: [
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Authorization',
      'Accept',
      'x-acc-k'
    ],
    exposeHeaders: [
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Authorization',
      'Accept',
      'x-acc-k'
    ]
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
