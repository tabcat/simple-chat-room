import { combineEpics } from 'redux-observable'

// import { ethEpic } from './network/eth'
import { chatEpic } from './chat/epic'
import { modalEpic } from './modal/epic'
import { navigationEpic } from './navigation/epic'
import { networkEpic } from './network/epic'
import { usersEpic } from './users/epic'

const AppEpic = combineEpics(
  // ethEpic,
  chatEpic,
  modalEpic,
  navigationEpic,
  networkEpic,
  usersEpic,
)

export { AppEpic }
