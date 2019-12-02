import React from 'react'
import PageLayout from '../components/PageLayout/PageLayout'

const HomePage = () => {
  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'home-page',
          url: '/',
          name: 'Home'
        }
      ]}
    >
      <div>Login</div>
    </PageLayout>
  )
}

export default HomePage
