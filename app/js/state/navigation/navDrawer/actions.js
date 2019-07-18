
const navDrawerActionTypes = {
  SET_SELECTED_CONTENT: 'SET_SELECTED_CONTENT',
  NAV_DRAWER_OPENNESS: 'NAV_DRAWER_OPENNESS',
  SET_NAV_DRAWER_STATE: 'SET_NAV_DRAWER_STATE',
}
const {
  SET_SELECTED_CONTENT,
  NAV_DRAWER_OPENNESS,
  SET_NAV_DRAWER_STATE,
} = navDrawerActionTypes

const navDrawerActionCreators = {
  setSelectedNavItem: selectedNavItem =>
    ({ type: SET_SELECTED_CONTENT, payload: {selectedNavItem} }),
  setNavDrawerOpenness: drawerOpen =>
    ({ type: NAV_DRAWER_OPENNESS, payload: {drawerOpen} }),
  setNavDrawerState: (drawerState) =>
    ({ type:SET_NAV_DRAWER_STATE, payload:{ drawerState } }),
}

export { navDrawerActionTypes, navDrawerActionCreators }
