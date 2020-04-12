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
import { tierMap } from '../helpers/tier.helper'

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
    open: true,
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
        name: 'Create',
        tier: tierMap.CREATE_COLLECTION.tier
      },
      {
        key: 'collection-list',
        url: pageRoutes.listCollections,
        name: 'List',
        tier: tierMap.GET_COLLECTION_LIST.tier
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
        name: 'Create',
        tier: tierMap.CREATE_SCHEMA.tier
      },
      {
        key: 'schema-create-from-json',
        url: pageRoutes.createSchemaFromJson,
        name: 'Create from JSON',
        tier: tierMap.CREATE_SCHEMA.tier
      },
      {
        key: 'schema-list',
        url: pageRoutes.listSchemas,
        name: 'List',
        tier: tierMap.GET_SCHEMA_LIST.tier
      },
      {
        key: 'schema-store',
        url: pageRoutes.schemaStore,
        name: 'Store',
        tier: tierMap.CREATE_SCHEMA.tier
      }
    ]
  },
  {
    key: 'user',
    open: true,
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
        name: 'Create',
        tier: tierMap.CREATE_USER.tier
      },
      {
        key: 'user-list',
        url: pageRoutes.listUsers,
        name: 'List',
        tier: tierMap.GET_USER_LIST.tier
      }
    ]
  },
  {
    key: 'access-key',
    open: true,
    tier: tierMap.GET_ACCESS_KEY_LIST.tier,
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
        name: 'Create',
        tier: tierMap.CREATE_ACCESS_KEY.tier
      },
      {
        key: 'access-key-list',
        url: pageRoutes.listAccessKeys,
        name: 'List',
        tier: tierMap.GET_ACCESS_KEY_LIST.tier
      }
    ]
  },
  {
    key: 'team-member',
    open: true,
    tier: tierMap.GET_MEMBER_LIST.tier,
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
        name: 'Create Member',
        tier: tierMap.CREATE_MEMBER.tier
      },
      {
        key: 'member-list',
        url: pageRoutes.listMembers,
        name: 'List',
        tier: tierMap.GET_MEMBER_LIST.tier
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
