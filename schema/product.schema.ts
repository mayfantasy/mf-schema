import { ETypes, ISchema } from '../types/schema.type'

export const skuFormat = /^[a-z0-9\-]+$/i

export const productSchema: ISchema = {
  sku: {
    type: ETypes.string,
    allowNull: false,
    validator: [
      (v: string) => {
        if (!skuFormat.test(v)) {
          return `"${v}" can only contain letters, numbers or dashes.`
        }
        return null
      }
    ]
  },
  factory_sku: {
    type: ETypes.string,
    allowNull: true
  },
  name: {
    type: ETypes.string,
    allowNull: false
  },
  gtin: {
    type: ETypes.string,
    allowNull: true
  },
  brand: {
    type: ETypes.string,
    allowNull: true
  },
  status: {
    type: ETypes.string,
    allowNull: false
  },
  fbm_only: {
    type: ETypes.boolean,
    allowNull: false
  },
  category: {
    type: ETypes.string,
    allowNull: true
  },
  variation_themes: {
    type: ETypes.object,
    allowNull: true
  },
  country_id: {
    type: ETypes.string,
    allowNull: false
  },
  is_parent: {
    type: ETypes.boolean,
    allowNull: false
  },
  parent_sku: {
    type: ETypes.boolean,
    allowNull: true
  },
  short_title: {
    type: ETypes.string,
    allowNull: true
  },
  long_title: {
    type: ETypes.string,
    allowNull: true
  },
  bullet_points: {
    type: ETypes.array,
    allowNull: false
  },
  text_description: {
    type: ETypes.string,
    allowNull: true
  },
  html_description: {
    type: ETypes.string,
    allowNull: true
  },
  keywords: {
    type: ETypes.string,
    allowNull: true
  },
  main_image: {
    type: ETypes.string,
    allowNull: true
  },
  secondary_images: {
    type: ETypes.array,
    allowNull: false
  },
  item_length: {
    type: ETypes.number,
    allowNull: false
  },
  item_width: {
    type: ETypes.number,
    allowNull: false
  },
  item_height: {
    type: ETypes.number,
    allowNull: false
  },
  item_weight: {
    type: ETypes.number,
    allowNull: false
  },
  package_length: {
    type: ETypes.number,
    allowNull: false
  },
  package_width: {
    type: ETypes.number,
    allowNull: false
  },
  package_height: {
    type: ETypes.number,
    allowNull: false
  },
  package_weight: {
    type: ETypes.number,
    allowNull: false
  },
  case_length: {
    type: ETypes.number,
    allowNull: false
  },
  case_width: {
    type: ETypes.number,
    allowNull: false
  },
  case_height: {
    type: ETypes.number,
    allowNull: false
  },
  case_weight: {
    type: ETypes.number,
    allowNull: false
  },
  case_pack: {
    type: ETypes.number,
    allowNull: false
  },
  fob: {
    type: ETypes.number,
    allowNull: false
  },
  msrp: {
    type: ETypes.number,
    allowNull: false
  },
  price: {
    type: ETypes.number,
    allowNull: false
  },
  sale_price: {
    type: ETypes.number,
    allowNull: false
  },
  asin: {
    type: ETypes.string,
    allowNull: true
  },
  main_customized: {
    type: ETypes.object,
    allowNull: true
  },
  other_customized: {
    type: ETypes.object,
    allowNull: true
  },
  workspace_id: {
    type: ETypes.object,
    allowNull: true
  }
}
