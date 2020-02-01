import Cors from 'micro-cors'
import { EApiMethod } from '../types/api.type'

export const cors = (methods: EApiMethod[]) =>
  Cors({
    allowMethods: methods.concat(EApiMethod.OPTIONS)
  })
