
import React from "react"
import { render } from "react-dom"

import { Provider } from 'react-redux'
import { AppState } from './state'

// import { UnnamedActionCreators } from './state/network'

import { network } from './network'

import Unnamed from "./components/unnamed"

// const componentsRoot =
//   <Provider store={AppState}>
//     <Unnamed/>
//   </Provider>


const rootElement = document.querySelector("#root")

if (rootElement) {
  render(
    <Provider store={AppState}>
      <Unnamed/>
    </Provider>,
    rootElement
  )
}

// network.on('profile', () => AppStore.dispatch(
//   UnnamedActionCreators.initializeSnetState(network))
// )
