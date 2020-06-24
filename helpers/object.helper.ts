import { Files } from 'formidable'
import * as xlsx from 'node-xlsx'
import { IKeyValue } from '../types/utils.type'
import { ISchema, ESchemaFieldType } from '../types/schema.type'
import { isArray } from 'util'

export const parseObjectsFromXlsx = (
  schema: ISchema,
  files: Files | undefined
) => {
  const file = (files as any).mf_xlsx_uploader

  if (file) {
    const { path, name } = file
    const sheet = xlsx.parse(file.path)

    // Data with titles
    const data = sheet[0].data

    // Titles
    const titles = data[0]
    // Make empty objects from title
    const emptyObject = titles.reduce((a, c) => {
      a[c] = ''
      return a
    }, {} as IKeyValue)

    // Convert to objects array
    const convertedData = data.reduce((a, c, i) => {
      if (i) {
        const object = { ...emptyObject }
        titles.forEach((t, ti) => {
          object[t] = c[ti]
        })
        return [...a, object]
      }
      return a
    }, [] as IKeyValue[])

    // Schema Defs Map
    const defsMap = schema.def.reduce((a, c) => {
      a.set(c.key, c.type)
      return a
    }, new Map())

    // Valid fields Map
    const validFieldsMap = titles.reduce((a, c) => {
      if (defsMap.has(c)) {
        a.set(c, defsMap.get(c))
      }
      return a
    }, new Map())
    validFieldsMap.set('_handle', 'string')

    // Filter valid fields
    const res = convertedData.map((i) => {
      const o = { ...i }
      Object.keys(i).forEach((_key) => {
        if (validFieldsMap.has(_key)) {
          switch (validFieldsMap.get(_key)) {
            case ESchemaFieldType.boolean: {
              if (i[_key] === 'FALSE' || i[_key] === 'false') {
                o[_key] = false
              } else if (i[_key] === 'TRUE' || i[_key] === 'true') {
                o[_key] = true
              } else {
                o[_key] = false
              }
              break
            }
            case ESchemaFieldType.number: {
              if (i[_key]) {
                if (isNaN(i[_key])) {
                  o[_key] = 0
                } else {
                  o[_key] = Number(i[_key])
                }
              } else {
                o[_key] = 0
              }

              break
            }
            case ESchemaFieldType.string_multi_select:
            case ESchemaFieldType.string_array: {
              o[_key] = i[_key] ? i[_key].split('||') : ''
              break
            }
            case ESchemaFieldType.image_array: {
              o[_key] = i[_key] ? i[_key].split('||') : ''
              break
            }
            default: {
              o[_key] = i[_key]
            }
          }
        } else {
          delete o[_key]
        }
      })
      return o
    })

    // Filter out objects without an Object Handle
    return res.filter((o) => o['_handle'])
  } else {
    return new Error('File not found.')
  }
}

export const convertObjectsToXlsxData = (
  objects: IKeyValue[],
  fields: string[]
) => {
  const _objects = objects
    .map((r: IKeyValue) => {
      const _r = fields.reduce((a, c) => {
        a[c] = r[c]
        return a
      }, {} as IKeyValue)
      delete _r.id
      delete _r._schema_handle
      return Object.keys(_r).reduce((a, c) => {
        a[c] = _r[c]
        if (typeof _r[c] === 'boolean') {
          a[c] = _r[c] ? 'TRUE' : 'FALSE'
        }
        if (isArray(_r[c])) {
          a[c] = _r[c].join('||')
        }

        return a
      }, {} as IKeyValue)
    })
    .sort()

  console.log(_objects)

  const keys = Object.keys(_objects[0])

  return [keys, ..._objects.map((o) => keys.map((k) => o[k] || ''))]
}
