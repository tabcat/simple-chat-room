
import { combineReducers } from 'redux'
// import reducerRegistry from '../reducerRegistry'

import { navDrawerReducer } from './navDrawer/reducer'
import { navListReducer } from './navList/reducer'

const navigationReducer = combineReducers({
  navDrawer: navDrawerReducer,
  navList: navListReducer
})

const reducerName = 'navigation'

// reducerRegistry.register(reducerName, navigationReducer)

export { navigationReducer }
