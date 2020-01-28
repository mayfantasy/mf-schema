const withLess = require('@zeit/next-less')
const withCss = require('@zeit/next-css')

const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './styles/theme.style.less'), 'utf8')
)

if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
}

module.exports = withCss(
  withLess({
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables
    }
  })
)
