
import { combineEpics } from 'redux-observable'

import { orbitDbsEpic } from './dbs/epic'
import { orbitTmsEpic } from './tms/epic'

const orbitEpic = combineEpics(
  orbitDbsEpic,
  orbitTmsEpic,
)

export { orbitEpic }
