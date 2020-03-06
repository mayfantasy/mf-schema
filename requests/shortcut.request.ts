import { api } from '.'
import { IShortcutForm, IShortcut } from '../types/shortcut.type'

export const createShortcutRequest = (shortcut: IShortcutForm) => {
  return api.post('/shortcut/create', shortcut)
}

export const getShortcutListRequest = () => {
  return api.get('/shortcut/list')
}

export const deleteShortcutRequest = (id: string) => {
  return api.delete(`/shortcut/delete/${id}`)
}
