
import { combineReducers } from 'redux'

// import { ethReducer } from './eth'
// import { SubnameReducer } from './subname'
import { orbitReducer } from './orbit/reducer'

const networkReducer = combineReducers({
  // eth: ethReducer,
  // subname: SubnameReducer,
  orbit: orbitReducer,
})

export { networkReducer }
