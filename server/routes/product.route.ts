import Koa from 'koa'
import {
  createProduct,
  getProductList,
  deleteProduct,
  getProductById,
  updateProduct
} from '../services/product.service'
import xlsx from 'node-xlsx'
import {
  sheetToLineObjects,
  lineObjectsToProducts
} from '../../helpers/product-import.helper'
import { IProductParseResult } from '../../types/product.type'
import { productSchema } from '../../schema/product.schema'
import { encode } from 'base64-arraybuffer'

export const getProductListRoute = async (ctx: Koa.Context) => {
  const { workspaceId, countryId } = ctx.params
  if (workspaceId && countryId) {
    const productList = await getProductList(workspaceId, countryId)

    ctx.body = {
      result: productList
    }
  } else {
    return new Error('Workspace or Country not defined.')
  }
}

export const getProductByIdRoute = async (ctx: Koa.Context) => {
  const { id } = ctx.params
  const product = await getProductById(id)
  ctx.body = {
    result: product
  }
}

export const createProductRoute = async (ctx: Koa.Context) => {
  const createProductPayload = ctx.request.body
  const newProduct = await createProduct(createProductPayload)
  ctx.body = {
    result: newProduct
  }
}

export const updateProductRoute = async (ctx: Koa.Context) => {
  const updateProductPayload = ctx.request.body
  const { id } = ctx.params
  const productUpdated = await updateProduct(id, updateProductPayload)
  ctx.body = {
    result: productUpdated
  }
}

export const deleteProductRoute = async (ctx: Koa.Context) => {
  const { id } = ctx.params
  const result = await deleteProduct(id)
  ctx.body = {
    result
  }
}

export const parseProductFileRoute = async (ctx: Koa.Context) => {
  const files = ctx.request.files
  const { workspaceId, countryId } = ctx.params
  if (files) {
    const { file } = files
    const { path, name } = file
    const sheet = xlsx.parse(file.path)
    const sheetData = sheet[0].data
    const lineObjects = sheetToLineObjects(sheetData)
    const uploadedProducts = lineObjectsToProducts(
      lineObjects,
      countryId,
      workspaceId
    )
    ctx.body = {
      result: {
        products: uploadedProducts.products,
        path,
        name,
        workspaceId,
        countryId,
        errors: uploadedProducts.errors
      } as IProductParseResult
    }
  } else {
    return new Error('File not found.')
  }
}

export const exportProductTemplateRoute = async (ctx: Koa.Context) => {
  const buffer = xlsx.build([
    { name: 'Product Template', data: [Object.keys(productSchema)] }
  ])
  ctx.body = encode(buffer)
}
