import React from 'react'
import ReactDOM from 'react-dom'

import AppContainer from './containers/App'

// --- Boot

// TODO: Make baseURL configurable
ReactDOM.render(
  <AppContainer title="B2Player" baseURL="http://localhost:9292" />,
  document.getElementById('app')
)

module.hot.accept()
