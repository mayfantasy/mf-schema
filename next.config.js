const withLess = require('@zeit/next-less')
const withCss = require('@zeit/next-css')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD
} = require('next/constants')

const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './styles/theme.style.less'), 'utf8')
)

const devEnv = {
  MF_SCHEMA_ACCOUNT_DB_KEY: 'fnADekK1_oACExkeSdTKIbz0q7b9VEejj2n6nuTT',
  JWT_SECRET: 'mf-schema-admin-2019',
  GOOGLE_STORAGE_BUCKET_NAME: 'schema-images',
  USER_JWT_SECRET: 'user-jwt-secret',
  RECOVER_EMAIL_ADDRESS: 'yuelun123321@hotmail.com',
  RECOVER_EMAIL_PASSWORD: '199051qQqQ'
}

const prodEnv = {
  MF_SCHEMA_ACCOUNT_DB_KEY: 'fnADekK1_oACExkeSdTKIbz0q7b9VEejj2n6nuTT',
  JWT_SECRET: 'mf-schema-admin-2019',
  GOOGLE_STORAGE_BUCKET_NAME: 'schema-images',
  USER_JWT_SECRET: 'user-jwt-secret',
  RECOVER_EMAIL_ADDRESS: 'yuelun123321@hotmail.com',
  RECOVER_EMAIL_PASSWORD: '199051qQqQ'
}

if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
}

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  return withCss(
    withLess({
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: themeVariables
      },
      webpack: (config) => {
        const newConfig = { ...config }
        newConfig.plugins = [
          ...config.plugins,
          new FilterWarningsPlugin({
            exclude: /mini-css-extract-plugin[^]*Conflicting order between:/
          })
        ]
        return newConfig
      },
      env: isDev ? devEnv : prodEnv
    })
  )
}
