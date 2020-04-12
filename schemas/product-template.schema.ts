import { IStoreSchema, ESchemaFieldType } from '../types/schema.type'

export const productSchema: IStoreSchema = {
  name: 'Product',
  handle: 'product',
  collection_id: '__PUT_A_COLLECTION_ID_HERE__',
  description:
    'Product template that covers most of the product fields used for e-commerce.',
  def: [
    {
      key: 'sku',
      type: ESchemaFieldType.string,
      name: 'SKU',
      helper: '',
      order: 1,
      grid: 8,
      show: true
    },
    {
      key: 'product_id',
      type: ESchemaFieldType.string,
      name: 'Product ID',
      helper: '',
      order: 1,
      grid: 8,
      show: false
    },
    {
      key: 'product_id_type',
      type: ESchemaFieldType.string_single_select,
      options: ['upc', 'ean'],
      name: 'Product ID Type',
      helper: '',
      order: 1,
      grid: 8,
      show: false
    },
    {
      key: 'name',
      type: ESchemaFieldType.string,
      name: 'Name',
      helper: '',
      order: 1,
      grid: 12,
      show: false
    },
    {
      key: 'asin',
      type: ESchemaFieldType.string,
      name: 'ASIN',
      helper: '',
      order: 1,
      grid: 6,
      show: true
    },
    {
      key: 'status',
      type: ESchemaFieldType.string_single_select,
      options: ['active', 'upcoming', 'discontinued'],
      name: 'Status',
      helper: '',
      order: 1,
      grid: 6,
      show: true
    },
    {
      key: 'brand',
      type: ESchemaFieldType.string,
      name: 'Brand',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'amazon_btg',
      type: ESchemaFieldType.string,
      name: 'Amazon BTG',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'amazon_category_route',
      type: ESchemaFieldType.string,
      name: 'Amazon Category Route',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'has_fba',
      type: ESchemaFieldType.boolean,
      name: 'Has FBA ?',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'category',
      type: ESchemaFieldType.string,
      name: 'Category',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'sub_category',
      type: ESchemaFieldType.string,
      name: 'Sub Category',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'is_parent',
      type: ESchemaFieldType.boolean,
      name: 'Is Parent ?',
      helper: '',
      order: 1,
      grid: 6,
      show: true
    },
    {
      key: 'parent_sku',
      type: ESchemaFieldType.string,
      name: 'Parent SKU',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'variation_theme',
      type: ESchemaFieldType.string,
      name: 'Variation Theme',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'variation_value',
      type: ESchemaFieldType.string,
      name: 'Variation Value',
      helper: '',
      order: 1,
      grid: 6,
      show: true
    },
    {
      key: 'title_short',
      type: ESchemaFieldType.string,
      name: 'Long Short',
      helper: '',
      order: 1,
      grid: 24,
      show: false
    },
    {
      key: 'title_long',
      type: ESchemaFieldType.string,
      name: 'Long Title',
      helper: '',
      order: 1,
      grid: 24,
      show: false
    },
    {
      key: 'bullet_points',
      type: ESchemaFieldType.string_array,
      name: 'Bullet Points',
      helper: '',
      order: 1,
      grid: 24,
      show: false
    },
    {
      key: 'description_text',
      type: ESchemaFieldType.textarea,
      name: 'Description Text',
      helper: '',
      order: 1,
      grid: 24,
      show: false
    },
    {
      key: 'description_html',
      type: ESchemaFieldType.rich_text,
      name: 'Description Text',
      helper: '',
      order: 1,
      grid: 24,
      show: false
    },
    {
      key: 'img_src_main',
      type: ESchemaFieldType.image,
      name: 'Image Main',
      helper: '',
      order: 1,
      grid: 8,
      show: true
    },
    {
      key: 'img_src_main_2',
      type: ESchemaFieldType.image,
      name: 'Main Image 2',
      helper: '',
      grid: 8,
      show: true
    },
    {
      key: 'img_src_1',
      type: ESchemaFieldType.image,
      name: 'Image 1',
      helper: '',
      order: 1,
      grid: 8,
      show: true
    },
    {
      key: 'img_src_2',
      type: ESchemaFieldType.image,
      name: 'Image 2',
      helper: '',
      order: 1,
      grid: 8,
      show: true
    },
    {
      key: 'img_src_3',
      type: ESchemaFieldType.image,
      name: 'Image 3',
      helper: '',
      order: 1,
      grid: 8,
      show: true
    },
    {
      key: 'img_src_4',
      type: ESchemaFieldType.image,
      name: 'Image 4',
      helper: '',
      order: 1,
      grid: 8,
      show: true
    },
    {
      key: 'img_src_5',
      type: ESchemaFieldType.image,
      name: 'Image 5',
      helper: '',
      order: 1,
      grid: 8,
      show: false
    },
    {
      key: 'img_src_6',
      type: ESchemaFieldType.image,
      name: 'Image 6',
      helper: '',
      order: 1,
      grid: 8,
      show: false
    },
    {
      key: 'img_src_7',
      type: ESchemaFieldType.image,
      name: 'Image 7',
      grid: 8,
      helper: '',
      show: false
    },
    {
      key: 'img_src_8',
      type: ESchemaFieldType.image,
      name: 'Image 8',
      grid: 8,
      helper: '',
      show: false
    },
    {
      key: 'price',
      type: ESchemaFieldType.number,
      name: 'Price',
      helper: '',
      order: 1,
      grid: 16,
      show: false
    },
    {
      key: 'sale_price',
      type: ESchemaFieldType.number,
      name: 'Sale Price',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'msrp',
      type: ESchemaFieldType.number,
      name: 'MSRP',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'fob',
      type: ESchemaFieldType.number,
      name: 'FOB',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'cost',
      type: ESchemaFieldType.number,
      name: 'Cost',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'package_length',
      type: ESchemaFieldType.number,
      name: 'Length',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'package_width',
      type: ESchemaFieldType.number,
      name: 'Width',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'package_heigt',
      type: ESchemaFieldType.number,
      name: 'Height',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    },
    {
      key: 'shipping_weight',
      type: ESchemaFieldType.number,
      name: 'Shipping Weight',
      helper: '',
      order: 1,
      grid: 6,
      show: false
    }
  ]
}
