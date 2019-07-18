
import { combineReducers } from 'redux'
// import reducerRegistry from './reducerRegistry'

import { networkReducer } from './network/reducer'
import { chatReducer } from './chat/reducer'
import { navigationReducer } from './navigation/reducer'
import { modalReducer } from './modal/reducer'
import { usersReducer } from './users/reducer'

const AppReducer = combineReducers({
  network: networkReducer,
  chat: chatReducer,
  navigation: navigationReducer,
  modal: modalReducer,
  users: usersReducer,
})

// reducerRegistry.register('state', navigationReducer)

export { AppReducer }
