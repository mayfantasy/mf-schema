import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  Default,
  BelongsTo,
  ForeignKey,
  Is
} from 'sequelize-typescript'

import { basicModelConfig } from '../../../config/db.config'
import {
  EProductStatus,
  EProductCategories,
  IVariationTheme,
  ICustomizedObject
} from '../../../types/product.type'
import Workspace from './workspace.model'
import { skuFormat } from '../../../schema/product.schema'

@Table({ modelName: 'product', ...basicModelConfig })
class Product extends Model<Product> {
  @AllowNull(false)
  @Is(function validateSkuString(value: string) {
    if (!skuFormat.test(value)) {
      throw new Error(`"${value}" can only contain letters, numbers or dashes.`)
    }
  })
  @Column({ type: DataType.TEXT })
  sku!: string

  @Column({ type: DataType.TEXT })
  factory_sku!: string

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  name!: string

  @Column({ type: DataType.TEXT })
  gtin!: string

  @Column({ type: DataType.TEXT })
  brand!: string

  @AllowNull(false)
  @Default(EProductStatus.ACTIVE)
  @Column({
    type: DataType.ENUM(
      EProductStatus.ACTIVE,
      EProductStatus.UPCOMING,
      EProductStatus.DISCONTINUED,
      EProductStatus.UNAVAILABEL
    )
  })
  status!: EProductStatus

  @Default(false)
  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  fbm_only!: boolean

  @Column({
    type: DataType.TEXT
  })
  category!: EProductCategories

  @Column({ type: DataType.JSON })
  variation_themes!: IVariationTheme[]

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  country_id!: string

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  is_parent!: boolean

  @Column({ type: DataType.TEXT })
  parent_sku!: string

  /**
   * Content
   */
  @Column({ type: DataType.TEXT })
  short_title!: string

  @Column({ type: DataType.TEXT })
  long_title!: string

  @AllowNull(false)
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  bullet_points!: string[]

  @Column({ type: DataType.TEXT })
  text_description!: string

  @Column({ type: DataType.TEXT })
  html_description!: string

  @Column({ type: DataType.TEXT })
  keywords!: string

  /**
   * Images
   */

  @Column({ type: DataType.TEXT })
  main_image!: string

  @AllowNull(false)
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  secondary_images!: string[]

  /**
   * Dimentions
   */

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  item_length!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  item_width!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  item_height!: number

  @Default(0)
  @AllowNull(false)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  item_weight!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  package_length!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  package_width!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  package_height!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  package_weight!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  case_length!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  case_width!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  case_height!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  case_weight!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  case_pack!: number

  /**
   * Prices
   */
  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  fob!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  msrp!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price!: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  sale_price!: number

  /**
   * Marketplace IDs
   */
  @Column({ type: DataType.TEXT })
  asin!: string

  /**
   * Main Customized Fields
   * (Important Usage)
   */
  @Column({ type: DataType.JSON })
  main_customized!: ICustomizedObject

  /**
   * Other Customized Fields
   * (Important Usage)
   */
  @Column({ type: DataType.JSON })
  other_customized!: ICustomizedObject

  @ForeignKey(() => Workspace)
  @Column
  workspace_id!: number

  @BelongsTo(() => Workspace)
  workspace!: Workspace
}

export default Product
