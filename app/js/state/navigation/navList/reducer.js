
import {
  navListActionTypes,
  navListSelectors,
  modalActionCreators,
} from '../../'
const {
  TOGGLE_EXPAND,
  ADD_NAV_ITEM,
  REMOVE_NAV_ITEM,
  SET_NAV_ITEM,
  SET_NAV_ITEM_PROP,
  SET_NAV_LIST_STATE,
} = navListActionTypes


const navItemEmptyFields = {
  componentName: null,
  props: null,
  open: null,
  children: null,
  action: null,
  nextId: null,
  prevId: null,
}

const unboundNavItemCreator = (config, empty = navItemEmptyFields) => {
  const { type, name, title, componentName, props, action } = config
  if (
    // required fields
    (!!type && !!name && !!title) &&
    (
      (type === 'link' && !!componentName && !!props) ||
      (type === 'expandable') || (type === 'createable' && action))
  ) {
    const navItemConstants = type === 'link'
      ? {}
      : type === 'expandable'
        ? { open: true }
        : {}
    const id = !config.id ? `${componentName}:${name}` : config.id
    return { ...empty, ...navItemConstants, ...config,  id }
  } else {
    console.error('navItem creation failed: required config fields not set correctly')
  }
}

const bindNavItem = (list, parentId, prevId, nextId, unboundNavItem) => {
  const { id } = unboundNavItem
  const updatedParent = parentId !== null
    ? {
      [parentId]: {
        ...list[parentId],
        children: [ ...list[parentId].children, id ],
      }
    }
    : {}
  const updatedPrev = prevId !== null
    ? { [prevId]: { ...list[prevId], nextId: id } }
    : {}
  const updatedNext = nextId !== null
    ? { [nextId]: { ...list[nextId], prevId: id } }
    : {}
  return {
    ...list,
    ...updatedParent,
    ...updatedPrev,
    ...updatedNext,
    [id]: {
      ...unboundNavItem,
      parentId,
      prevId,
      nextId,
    }
  }
}

const prunedObj = (obj, removedKeys) =>
  Object.keys(obj).filter((key1) =>
  removedKeys.filter((key2) => key1 === key2).length !== 1)
  .reduce((accu, key) => ({ ...accu, [key]:obj[key] }), {})

const unbindNavItem = (list, boundNavItem) => {
  const { id, parentId, prevId, nextId } = boundNavItem
  const updatedParent = !!parentId && parentId !== null
    ? {
      [parentId]: {
        ...list[parentId],
        children: list[parentId].children.filter((child) => child !== id)
      }
    }
    : {}
  const updatedPrev = prevId !== null
    ? { [prevId]: { ...list[prevId], nextId } }
    : {}
  const updatedNext = nextId !== null
    ? { [nextId]: { ...list[nextId], prevId } }
    : {}
  const navItemRemoved = prunedObj(list, [id])
  const unboundNavItem = {
    ...boundNavItem,
    parentId: null,
    prevId: null,
    nextId: null
  }
  return {
    list: {
      ...navItemRemoved,
      ...updatedParent,
      ...updatedPrev,
      ...updatedNext
    },
    navItem: unboundNavItem
  }
}

const addNewNavItem = (list, parentId, navItemConfig) => {
  const parent = list[parentId]
  const prevId = parent.children.length !== 0
    ? navListSelectors.getLastChild(list, parentId)
    : null
  return bindNavItem(
    list,
    parentId,
    prevId,
    null,
    unboundNavItemCreator(navItemConfig)
  )
}

const removeNavItem = (list, navItem) => unbindNavItem(list, navItem).list

const expandableOpen = (list, payload) => ({
  ...list,
  [payload.id]: {
    ...list[payload.id],
    open: !list[payload.id].open
  }
})

const setNavItemProp = (state, navItem, propId, value) => ({
  ...navItem,
  props: {
    ...navItem.props,
    [propId]: value
  },
})

const setNavItemPropWithPayload = (state, payload) => {
  const { navItemId, propId, value } = payload
  const navItem = state[navItemId]
  return setNavItemProp(state, navItem, propId, value)
}

const rootNavItemConfig = {
  id: 'root',
  type: 'expandable',
  name: 'root',
  title: 'root',
  parentId: null,
  children: ['profile', 'chat'],
  open: true
}

const rootNavItemInitialState = {
  ...unboundNavItemCreator(rootNavItemConfig, navItemEmptyFields),
  parentId: null,
  prevId: null,
  nextId: null,
}

const INITIAL_STATE = {
  root: rootNavItemInitialState,
  profile: unboundNavItemCreator({
    id: 'profile',
    type: 'link',
    name: 'profile',
    title: 'Profile',
    parentId: 'root',
    prevId: null,
    nextId: 'chat',
    componentName: 'profile',
    props: {}
  }),
  chat: unboundNavItemCreator({
    id: 'chat',
    type: 'expandable',
    name: 'chat',
    title: 'Chat',
    parentId: 'root',
    children: ['createChat', 'chatroom:public'],
    prevId: 'profile',
    nextId: null,
  }),
  createChat: unboundNavItemCreator({
    id: 'createChat',
    type: 'createable',
    name: 'create chat',
    title: 'new chat',
    parentId: 'chat',
    prevId: null,
    nextId: 'chatroom:public',
    action: modalActionCreators.setModalType('createChatroom')
  }),
  'chatroom:public': unboundNavItemCreator({
    id: 'chatroom:public',
    type: 'link',
    name: 'public',
    title: 'public',
    parentId: 'chat',
    prevId: 'createChat',
    nextId: null,
    componentName: 'chatroom',
    props: {
      name: 'public',
      orbitType: 'feed',
      orbitOptions:{
        accessController: { type:'ipfs', write: ['*'] },
      },
      orbitAddr: null,
      initializing: false,
    }
  })
}

function navListReducer(state = INITIAL_STATE, action) {
  const { payload } = action
  switch (action.type) {
    case ADD_NAV_ITEM:
      return addNewNavItem(
          state,
          payload.binds.parentId,
          payload.navItemConfig
        )
    case REMOVE_NAV_ITEM:
      return removeNavItem(
        state,
        payload.navItem,
      )
    case SET_NAV_ITEM:
      const unboud = unbindNavItem(state, payload.navItem)
      return bindNavItem(
        unbound.list,
        payload.parentId,
        payload.prevId,
        payload.nextId,
        unbound.navItem,
      )
    case SET_NAV_ITEM_PROP:
      return {
        ...state,
        [payload.navItemId]: setNavItemPropWithPayload(state, payload)
      }
    case TOGGLE_EXPAND:
      return expandableOpen(state, payload)
    case SET_NAV_LIST_STATE:
      return { ...payload.listState }
    default:
      return state
  }
}

export { navListReducer }
