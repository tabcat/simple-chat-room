
import { combineEpics } from 'redux-observable'

// import { navDrawerEpic } from './navDrawer'
import { navListEpic } from './navList/epic'

const navigationEpic = combineEpics(
  // navDrawerEpic,
  navListEpic,
)

export { navigationEpic }
