import { api } from '.'
import {
  ICreateMemberPayload,
  IUpdateMemberPayload
} from '../types/member.type'

export const createMemberRequest = (member: ICreateMemberPayload) => {
  return api.post('/member/create', member)
}

export const getMemberListRequest = () => {
  return api.get('/member/list')
}

export const getMemberByIdRequest = (id: string) => {
  return api.get(`/member/get/${id}`)
}

export const updateMemberByIdRequest = (payload: IUpdateMemberPayload) => {
  return api.put(`/member/update`, payload)
}

export const deleteMemberRequest = (id: string) => {
  return api.delete(`/member/delete/${id}`)
}
