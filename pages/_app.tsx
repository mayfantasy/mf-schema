import { AppPropsType } from 'next/dist/next-server/lib/utils'
import 'antd/dist/antd.less'
import '../styles/global.style.less'

const MyApp = (context: AppPropsType) => {
  const { Component, pageProps } = context
  return <Component {...pageProps} />
}

export default MyApp
