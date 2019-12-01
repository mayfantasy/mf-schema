import { createContext } from 'react'
import { observable, action } from 'mobx'
import { ECountry } from '../types/country.type'
import { IWorkspace } from '../types/workspace.type'

class EntryStore {
  @observable
  currentCountry: ECountry = ECountry.ca
  @observable
  currentWorkspace: IWorkspace | null = null

  @action
  setCurrentCountry = (coutnryId: ECountry) => {
    this.currentCountry = coutnryId
  }

  @action
  setCurrentWorkspace = (workspace: IWorkspace) => {
    this.currentWorkspace = workspace
  }
}
export default createContext(new EntryStore())
