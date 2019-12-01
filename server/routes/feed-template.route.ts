import Koa from 'koa'
import {
  createFeedTemplate,
  getFeedTemplateList,
  updateFeedTemplate,
  deleteFeedTemplate,
  getFeedTemplateById
} from '../services/feed-template.service'
import xlsx from 'node-xlsx'
import { IFeedTemplateParseResult } from '../../types/feed-template.type'
import {
  detectFirstRow,
  parseMustache
} from '../../helpers/feed-template.helper'
import { getProductListBySkus } from '../services/product.service'
import { encode } from 'base64-arraybuffer'

export const getFeedTemplateListRoute = async (ctx: Koa.Context) => {
  const { workspaceId, countryId } = ctx.params
  const feedTemplateList = await getFeedTemplateList(workspaceId, countryId)
  ctx.body = {
    result: feedTemplateList
  }
}

export const createFeedTemplateRoute = async (ctx: Koa.Context) => {
  const createFeedTemplatePayload = ctx.request.body
  const newFeedTemplate = await createFeedTemplate(createFeedTemplatePayload)
  ctx.body = {
    result: newFeedTemplate
  }
}

export const getFeedTemplateByIdRoute = async (ctx: Koa.Context) => {
  const { id } = ctx.params
  const feedTemplate = await getFeedTemplateById(id)
  ctx.body = {
    result: feedTemplate
  }
}

export const updateFeedTemplateRoute = async (ctx: Koa.Context) => {
  const updateFeedTemplatePayload = ctx.request.body
  const { id } = ctx.params
  const feedTemplateUpdated = await updateFeedTemplate(
    id,
    updateFeedTemplatePayload
  )
  ctx.body = {
    result: feedTemplateUpdated
  }
}

export const deleteFeedTemplateRoute = async (ctx: Koa.Context) => {
  const { id } = ctx.params
  const result = await deleteFeedTemplate(id)
  ctx.body = {
    result
  }
}

export const parseFeedTemplateFileRoute = async (ctx: Koa.Context) => {
  const files = ctx.request.files
  const { workspaceId, countryId } = ctx.params
  if (files) {
    const { file } = files
    const { path, name } = file
    const sheet = xlsx.parse(file.path)
    const sheetData = sheet[0].data

    const firstRowIndex = detectFirstRow(sheetData)

    if (!firstRowIndex) {
      return new Error('Definition not found.')
    }

    if (firstRowIndex - 1 < 0) {
      return new Error('Fields not found.')
    }

    if (firstRowIndex - 2 < 0) {
      return new Error('Display names not found.')
    }

    ctx.body = {
      result: {
        data: {
          display_names: sheetData[firstRowIndex - 2],
          fields: sheetData[firstRowIndex - 1],
          definitions: sheetData[firstRowIndex]
        },
        path,
        name,
        workspaceId,
        countryId,
        errors: []
      } as IFeedTemplateParseResult
    }
  } else {
    return new Error('File not found.')
  }
}

export const fillFeedTemplateWithProductRoute = async (ctx: Koa.Context) => {
  const { skus, template_id, workspace_id, country_id } = ctx.request.body

  const products = await getProductListBySkus(workspace_id, country_id, skus)
  const template = await getFeedTemplateById(template_id)

  if (template && products && products.length) {
    const data = [template.display_names, template.fields]

    products.forEach((p) => {
      data.push(template.definitions.map((d) => (d ? parseMustache(d, p) : '')))
    })

    const buffer = xlsx.build([{ name: 'Product Feed File', data }])
    ctx.body = encode(buffer)
  } else {
    throw new Error('Template or products not found.')
  }
}
