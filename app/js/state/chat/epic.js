
import { combineEpics } from 'redux-observable'

import { chatFeedsEpic } from './feeds/epic'
import { chatRoomsEpic } from './rooms/epic'

const chatEpic = combineEpics(
  chatFeedsEpic,
  chatRoomsEpic,
)

export { chatEpic }
