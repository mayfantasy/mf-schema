import { productSchema } from '../schema/product.schema'
import { ETypes } from '../types/schema.type'
import { IProduct } from '../types/product.type'
import { ECountry } from '../types/country.type'

export const sheetToLineObjects = (sheetData: string[][]) => {
  if (sheetData.length <= 1) {
    return new Error('No data')
  } else {
    const keys = sheetData[0]

    const productData = sheetData.slice(1, sheetData.length)
    const lineObjects: any = []

    productData.forEach((dline, lineIndex) => {
      const product: { [prop: string]: string | null } = {}
      keys.forEach((key, keyIndex) => {
        product[key] = dline[keyIndex] || null
      })
      lineObjects.push(product)
    })
    return lineObjects
  }
}

const setProductDefaultValues = (p: { [prop: string]: any }) => {
  const product: {
    [prop: string]: any
  } = {}
  Object.keys(productSchema).forEach((k) => {
    if (!p[k] && !productSchema[k].allowNull) {
      switch (productSchema[k].type) {
        case ETypes.string: {
          product[k] = ''
          break
        }
        case ETypes.number: {
          product[k] = 0
          break
        }
        case ETypes.boolean: {
          product[k] = false
          break
        }
        case ETypes.array: {
          product[k] = []
          break
        }
        case ETypes.object: {
          product[k] = {}
          break
        }
        default: {
          p[k] = null
        }
      }
    } else {
      product[k] = p[k] || null
    }
  })
  return product
}

export const lineObjectsToProducts = (
  lineObjects: Array<{ [prop: string]: string | null }>,
  countryId: ECountry,
  workspaceId: number
): { errors: string[]; products: Array<{ [prop: string]: any }> } => {
  const io = lineObjects.map((l) => {
    const p: { [prop: string]: any | null } = {}
    Object.keys(l).forEach((k) => {
      if (productSchema[k]) {
        switch (productSchema[k].type) {
          case ETypes.string: {
            if (productSchema[k].allowNull) {
              p[k] = l[k]
            } else {
              p[k] = l[k] || ''
            }
            break
          }
          case ETypes.number: {
            if (productSchema[k].allowNull) {
              const num = l[k]
              p[k] = num ? (isNaN(num as any) ? null : Number(num)) : null
            } else {
              const num = l[k]
              p[k] = num ? (isNaN(num as any) ? 0 : Number(num)) : 0
            }
            break
          }
          case ETypes.boolean: {
            if (l[k] === 'FALSE') {
              p[k] = false
            } else if (l[k] === 'TRUE') {
              p[k] = true
            } else {
              if (productSchema[k].allowNull) {
                p[k] = l[k]
              } else {
                p[k] = !!l[k]
              }
            }
            break
          }
          case ETypes.array: {
            p[k] = l[k] ? (l[k] as string).split('||') : []
            break
          }
          case ETypes.object: {
            p[k] = l[k] ? JSON.parse(l[k] as string) : null
            break
          }
          default: {
            p[k] = null
          }
        }
      }
    })
    return p
  })
  return {
    errors: [],
    products: io
      .filter((o) => o.sku)
      .map((p) => {
        return {
          ...setProductDefaultValues(p),
          country_id: countryId,
          workspace_id: workspaceId
        }
      })
  }
}
