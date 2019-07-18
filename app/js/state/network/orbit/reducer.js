
import { combineReducers } from 'redux'

import { orbitDbsReducer } from './dbs/reducer'
import { orbitTmsReducer } from './tms/reducer'

const orbitReducer = combineReducers({
  dbs: orbitDbsReducer,
  tms: orbitTmsReducer,
})

export { orbitReducer }
