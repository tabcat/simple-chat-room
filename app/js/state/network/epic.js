
import { combineEpics } from 'redux-observable'

import { orbitEpic } from './orbit/epic'

const networkEpic = combineEpics(
  orbitEpic,
)

export { networkEpic }
