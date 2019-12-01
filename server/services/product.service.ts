import Product from '../db/models/product.model'
import {
  ICreateProductPayload,
  IUpdateProductPayload
} from '../../types/product.type'
import { ECountry } from '../../types/country.type'

export const createProduct = async (product: ICreateProductPayload) => {
  const newProduct = new Product(product)
  const result = await newProduct.save()
  return result
}

export const updateProduct = async (
  id: number,
  product: IUpdateProductPayload
) => {
  const result = await Product.update(product, {
    returning: true,
    where: { id }
  })
  return result[1][0]
}

export const getProductList = async (
  workspace_id: number,
  country_id: ECountry
) => {
  const result = await Product.findAll({
    where: {
      workspace_id,
      country_id
    }
  })
  return result
}

export const getProductListBySkus = async (
  workspace_id: number,
  country_id: ECountry,
  skus: string[]
) => {
  const result = await Product.findAll({
    where: {
      workspace_id,
      country_id,
      sku: skus
    }
  })
  return result
}

export const getProductById = async (id: number) => {
  const result = await Product.findByPk(id)
  return result
}

export const deleteProduct = async (id: number) => {
  const result = await Product.destroy({
    where: {
      id
    }
  })
  return { id }
}
