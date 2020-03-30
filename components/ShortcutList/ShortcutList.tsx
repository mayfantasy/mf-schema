import { useEffect, useState } from 'react'
import { RequestStatus } from '../../helpers/request'
import { IShortcutForm, IShortcut } from '../../types/shortcut.type'
import {
  createShortcutRequest,
  getShortcutListRequest,
  deleteShortcutRequest
} from '../../requests/shortcut.request'
import { Typography, Row, Alert } from 'antd'
import ShortcutCard from '../ShortcutCard/ShortcutCard'
import { pageRoutes } from '../../navigation/page-routes'
import Loading from '../Loading/Loading'
import TierWrapper from '../TierButton/TierButton'
import { tierMap } from '../../helpers/tier.helper'

interface IProps {}

const ShortcutList = (props: IProps) => {
  useEffect(() => {
    getShortcutList()
  }, [])
  // Create Shortcuts
  const [shortcuts, setShortcuts] = useState<IShortcut[]>([])
  const createShortcutReq = new RequestStatus()
  const [createShortcutStatus, setCreateShortcutStatus] = useState(
    createShortcutReq.status
  )

  const createShortcut = (form: IShortcutForm) => {
    setCreateShortcutStatus(createShortcutReq.loading)
    createShortcutRequest(form)
      .then(() => {
        setCreateShortcutStatus(createShortcutReq.success)
        getShortcutList()
      })
      .catch((e) => {
        setCreateShortcutStatus(createShortcutReq.error(e))
      })
  }

  // Get Shortcut List
  const getShortcutListReq = new RequestStatus()
  const [getShortcutListStatus, setGetShortcutListStatus] = useState(
    getShortcutListReq.status
  )

  const getShortcutList = () => {
    setGetShortcutListStatus(getShortcutListReq.loading)
    getShortcutListRequest()
      .then((res: any) => {
        setGetShortcutListStatus(getShortcutListReq.success)
        setShortcuts(res.data.result as IShortcut[])
      })
      .catch((e) => {
        setGetShortcutListStatus(getShortcutListReq.error(e))
      })
  }

  // Delete Shortcut
  const deleteShortcutReq = new RequestStatus()
  const [deleteShortcutStatus, setDeleteShortcutStatus] = useState(
    createShortcutReq.status
  )

  const deleteShortcut = (id: string) => {
    setDeleteShortcutStatus(deleteShortcutReq.loading)
    deleteShortcutRequest(id)
      .then(() => {
        setDeleteShortcutStatus(deleteShortcutReq.success)
        getShortcutList()
      })
      .catch((e) => {
        setDeleteShortcutStatus(deleteShortcutReq.error(e))
      })
  }
  return (
    <>
      {createShortcutStatus.error && (
        <>
          <br />
          <Alert message={createShortcutStatus.error} type="error" />
        </>
      )}
      {getShortcutListStatus.error && (
        <>
          <br />
          <Alert message={getShortcutListStatus.error} type="error" />
        </>
      )}
      {deleteShortcutStatus.error && (
        <>
          <br />
          <Alert message={deleteShortcutStatus.error} type="error" />
        </>
      )}
      <br />
      {getShortcutListStatus.loading ? (
        <Loading />
      ) : (
        <div>
          <Typography>Shortcuts</Typography>
          <Row gutter={1}>
            {shortcuts.map((s) => {
              return (
                <ShortcutCard
                  key={s.id}
                  id={s.id}
                  title={s.title}
                  url={s.url}
                  isAdd={false}
                  deleting={deleteShortcutStatus.loading}
                  deleteShortcut={deleteShortcut}
                />
              )
            })}
            <TierWrapper tier={tierMap.CREATE_SHORTCUT.tier}>
              <ShortcutCard
                isAdd={true}
                creating={createShortcutStatus.loading}
                createShortcut={createShortcut}
              />
            </TierWrapper>
          </Row>
        </div>
      )}
    </>
  )
}
export default ShortcutList
