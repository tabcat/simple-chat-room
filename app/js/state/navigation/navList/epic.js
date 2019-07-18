
import { combineEpics, ofType } from 'redux-observable'
import { concat, from } from 'rxjs'
import {
  filter,
  map,
  mergeMap,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators'

import {
  navDrawerSelectors,
  navDrawerActionCreators,
  navListActionTypes,
  navListActionCreators,
  navListSelectors,
  chatRoomsActionTypes,
  chatRoomsActionCreators,
  chatFeedsActionCreators,
  usersSelectors,
  orbitDbsActionCreators,
} from '../../'
const {
  SET_NAV_ITEM_PROP,
  ADD_NAV_ITEM,
  REQ_REMOVE_NAV_ITEM,
} = navListActionTypes
const { getSelectedNavItem } = navDrawerSelectors
const { setSelectedNavItem } = navDrawerActionCreators
const { getNavListState } = navListSelectors
const { removeNavItem } = navListActionCreators
const { SET_NEW_CHATROOM } = chatRoomsActionTypes
const { removeChatRoom } = chatRoomsActionCreators
const { reqChatFeedUpdate } = chatFeedsActionCreators
const { getCurrentUserName } = usersSelectors
const { openDbOrbit, dropDbOrbit } = orbitDbsActionCreators

const chatRoomNavItemEpic = (userName, payload) => {
  const { componentName, name, props } = payload.navItemConfig
  return concat(
    from([payload]).pipe(
      map(() =>
        openDbOrbit({
          name,
          userName,
          navItemId: `${componentName}:${name}`,
          purpose: SET_NEW_CHATROOM,
          initializing: true,
          orbitType: props.orbitType,
          orbitOptions: props.orbitOptions,
          write: reqChatFeedUpdate,
          replicated: reqChatFeedUpdate,
        })
      ),
    ),
  )
}

const addNavItemEpicSwitch = (componentName) => {
  switch (componentName) {
    case 'chatroom':
      return chatRoomNavItemEpic
  }
}

const newNavItemEpic = (action$, state$) => action$.pipe(
  ofType(ADD_NAV_ITEM),
  withLatestFrom(state$),
  mergeMap(([{payload}, state]) =>
    addNavItemEpicSwitch(
      payload.navItemConfig.componentName,
    )(
      usersSelectors.getCurrentUserName(state),
      payload,
    )
  ),
)

const initNavItemEpic = (action$, state$) => action$.pipe(
  ofType(SET_NAV_ITEM_PROP),
  filter(({payload}) => !!payload.init),
  map(({payload}) => ({
    type:payload.init, payload:{ ...payload, init:false }
  })),
)

const removeNavItemActionsSwitch = (componentName) => {
  switch (componentName) {
    case 'chatroom':
      return [dropDbOrbit, removeChatRoom]
  }
}

const removeNavItemEpic = (action$, state$) => action$.pipe(
  ofType(REQ_REMOVE_NAV_ITEM),
  withLatestFrom(state$),
  mergeMap(([{payload}, state]) => {
    const actionCreators =
      removeNavItemActionsSwitch(payload.navItem.componentName)
    return concat(
      from([1]).pipe(
        filter(() => getSelectedNavItem(state) === payload.navItem.id),
        map(() =>
          setSelectedNavItem(
            !!getNavListState(state)[payload.navItem.prevId].type === 'link'
              ? payload.navItem.prevId
              : 'profile'
          )
        ),
      ),
      from([1]).pipe(
        map(() => removeNavItem(payload.navItem)),
      ),
      from(actionCreators).pipe(
        map((creator) => creator(payload.navItem))
      ),
    )
  }),
)

const navListEpic = combineEpics(
  newNavItemEpic,
  initNavItemEpic,
  removeNavItemEpic,
)

export { navListEpic }
