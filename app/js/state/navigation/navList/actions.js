
const navListActionTypes = {
  TOGGLE_EXPAND: 'TOGGLE_EXPAND',
  ADD_NAV_ITEM: 'ADD_NAV_ITEM',
  SET_NAV_ITEM: 'SET_NAV_ITEM',
  SET_NAV_ITEM_PROP: 'SET_NAV_ITEM_PROP',
  REQ_REMOVE_NAV_ITEM: 'REQ_REMOVE_NAV_ITEM',
  REMOVE_NAV_ITEM: 'REMOVE_NAV_ITEM',
  SET_NAV_LIST_STATE: 'SET_NAV_LIST_STATE',
}
const {
  TOGGLE_EXPAND,
  ADD_NAV_ITEM,
  SET_NAV_ITEM,
  SET_NAV_ITEM_PROP,
  REQ_REMOVE_NAV_ITEM,
  REMOVE_NAV_ITEM,
  SET_NAV_LIST_STATE,
} = navListActionTypes

const navListActionCreators = {
  toggleExpand: payload => ({ type: TOGGLE_EXPAND, payload }),
  setNavItemProp: (payload, propId) => ({
    type: SET_NAV_ITEM_PROP,
    payload:{ ...payload, value:payload[propId], propId }
  }),
  addNavItem: (binds, navItemConfig) =>
    ({ type:ADD_NAV_ITEM, payload:{ binds, navItemConfig } }),
  reqRemoveNavItem: (navItem) =>
    ({ type:REQ_REMOVE_NAV_ITEM, payload:{ navItem } }),
  removeNavItem: (navItem) =>
    ({ type:REMOVE_NAV_ITEM, payload:{ navItem } }),
  setNavListState: (listState) =>
    ({ type:SET_NAV_LIST_STATE, payload:{ listState } }),
}

export { navListActionTypes, navListActionCreators }
