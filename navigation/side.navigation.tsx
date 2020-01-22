import { INavItem } from '../types/navigation.type'
import { Icon } from 'antd'
import { pageRoutes } from './page-routes'

export const sideNavItems: INavItem[] = [
  {
    key: 'collection',
    open: true,
    name: (
      <span>
        <Icon type="folder" />
        Collection
      </span>
    ),
    children: [
      {
        key: 'collection-create',
        url: pageRoutes.createCollection,
        name: 'Create'
      },
      {
        key: 'collection-list',
        url: pageRoutes.listCollections,
        name: 'List'
      }
    ]
  },
  {
    key: 'schema',
    open: true,
    name: (
      <span>
        <Icon type="build" />
        Schema
      </span>
    ),
    children: [
      {
        key: 'schema-create',
        url: pageRoutes.createSchema,
        name: 'Create'
      },
      {
        key: 'schema-list',
        url: pageRoutes.listSchemas,
        name: 'List'
      }
    ]
  },
  {
    key: 'user',
    open: true,
    name: (
      <span>
        <Icon type="user" />
        User
      </span>
    ),
    children: [
      {
        key: 'user-create',
        url: pageRoutes.createUser,
        name: 'Create'
      },
      {
        key: 'user-list',
        url: pageRoutes.listUsers,
        name: 'List'
      }
    ]
  },
  {
    key: 'access-key',
    open: true,
    name: (
      <span>
        <Icon type="key" />
        Access Key
      </span>
    ),
    children: [
      {
        key: 'access-key-create',
        url: pageRoutes.createAccessKey,
        name: 'Create'
      },
      {
        key: 'access-key-list',
        url: pageRoutes.listAccessKeys,
        name: 'List'
      }
    ]
  },
  {
    key: 'docs',
    open: true,
    name: (
      <span>
        <Icon type="read" />
        Documentation
      </span>
    ),
    children: [
      {
        key: 'collection',
        url: pageRoutes.collectionDoc,
        name: 'Collection'
      },
      {
        key: 'schema',
        url: pageRoutes.schemaDoc,
        name: 'Schema'
      },
      {
        key: 'user',
        url: pageRoutes.userDoc,
        name: 'User'
      },
      {
        key: 'access-key',
        url: pageRoutes.accessKeyDoc,
        name: 'Access Key'
      },
      {
        key: 'api',
        url: pageRoutes.apiRefDoc,
        name: 'API Reference'
      }
    ]
  }
]
