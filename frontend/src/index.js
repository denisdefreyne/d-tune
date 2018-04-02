import React from 'react'
import ReactDOM from 'react-dom'

import AppContainer from './containers/App'

ReactDOM.render(
  <AppContainer baseURL={process.env.API_URL} />,
  document.getElementById('app')
)
