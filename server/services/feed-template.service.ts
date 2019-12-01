import FeedTemplate from '../db/models/feed-template.model'
import {
  ICreateFeedTemplatePayload,
  IUpdateFeedTemplatePayload
} from '../../types/feed-template.type'
import { ECountry } from '../../types/country.type'

export const createFeedTemplate = async (
  feedTemplat: ICreateFeedTemplatePayload
) => {
  const newFeedTemplate = new FeedTemplate(feedTemplat)
  const result = await newFeedTemplate.save()
  return result
}

export const getFeedTemplateList = async (
  workspace_id: number,
  country_id: ECountry
) => {
  const result = await FeedTemplate.findAll({
    where: {
      workspace_id,
      country_id
    }
  })
  return result
}

export const getFeedTemplateById = async (id: number) => {
  const result = await FeedTemplate.findByPk(id)
  return result
}

export const updateFeedTemplate = async (
  id: number,
  feedTemplate: IUpdateFeedTemplatePayload
) => {
  const result = await FeedTemplate.update(feedTemplate, {
    returning: true,
    where: { id }
  })
  return result[1][0]
}

export const deleteFeedTemplate = async (id: number) => {
  const result = await FeedTemplate.destroy({
    where: {
      id
    }
  })
  return { id }
}
