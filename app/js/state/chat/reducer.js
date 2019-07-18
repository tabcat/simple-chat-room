
import { combineReducers } from 'redux'

import { chatFeedsReducer } from './feeds/reducer'
import { chatRoomsReducer } from './rooms/reducer'

const chatReducer = combineReducers({
  feeds: chatFeedsReducer,
  rooms: chatRoomsReducer,
})

export { chatReducer }
