
// import reducerRegistry from '../../reducerRegistry'
import { navDrawerActionTypes, reducerName } from '../../'
const {
  SET_SELECTED_CONTENT,
  NAV_DRAWER_OPENNESS,
  SET_NAV_DRAWER_STATE,
} = navDrawerActionTypes

const INITIAL_STATE = {
  selectedNavItem: 'chatroom:public',
  drawerOpen: false,
}

function navDrawerReducer(state = INITIAL_STATE, action) {
  const { payload } = action
  switch (action.type) {
    case SET_SELECTED_CONTENT:
      return { ...state, selectedNavItem: payload.selectedNavItem, drawerOpen: false }
    case NAV_DRAWER_OPENNESS:
      return { ...state, drawerOpen: payload.drawerOpen }
    // case SET_MODAL_OPENNESS:
    case SET_NAV_DRAWER_STATE:
      return { ...payload.drawerState }
    default:
      return state
  }
}

// reducerRegistry.register(reducerName, navDrawerReducer)

export { navDrawerReducer }
