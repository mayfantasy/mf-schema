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

const env = {
  MF_SCHEMA_ACCOUNT_DB_KEY: process.env.MF_SCHEMA_ACCOUNT_DB_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_STORAGE_BUCKET_NAME: process.env.GOOGLE_STORAGE_BUCKET_NAME,
  USER_JWT_SECRET: process.env.USER_JWT_SECRET,
  RECOVER_EMAIL_ADDRESS: process.env.RECOVER_EMAIL_ADDRESS,
  RECOVER_EMAIL_PASSWORD: process.env.RECOVER_EMAIL_PASSWORD,
  GCP_STORAGE_CLIENT_EMAIL: process.env.GCP_STORAGE_CLIENT_EMAIL,
  GCP_STORAGE_PRIVATE_KEY: process.env.GCP_STORAGE_PRIVATE_KEY
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
      env
    })
  )
}
