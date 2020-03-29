import { INavItem } from '../types/navigation.type'
import { pageRoutes } from './page-routes'
import {
  AppstoreOutlined,
  FolderOpenOutlined,
  BuildOutlined,
  UserOutlined,
  KeyOutlined,
  FileTextOutlined,
  TeamOutlined
} from '@ant-design/icons'

export const sideNavItems: INavItem[] = [
  {
    key: 'dashboard',
    url: pageRoutes.home,
    name: (
      <span>
        <AppstoreOutlined />
        Dashboard
      </span>
    )
  },
  {
    key: 'collection',
    open: false,
    name: (
      <span>
        <FolderOpenOutlined />
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
        <BuildOutlined />
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
        key: 'schema-create-from-json',
        url: pageRoutes.createSchemaFromJson,
        name: 'Create from JSON'
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
    open: false,
    name: (
      <span>
        <UserOutlined />
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
    open: false,
    name: (
      <span>
        <KeyOutlined />
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
    key: 'team-member',
    open: false,
    name: (
      <span>
        <TeamOutlined />
        Team Member
      </span>
    ),
    children: [
      {
        key: 'member-create',
        url: pageRoutes.createMember,
        name: 'Create Member'
      },
      {
        key: 'member-list',
        url: pageRoutes.listMembers,
        name: 'List'
      }
    ]
  },
  {
    key: 'docs',
    open: false,
    name: (
      <span>
        <FileTextOutlined />
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
