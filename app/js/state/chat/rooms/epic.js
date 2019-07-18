
import { combineEpics, ofType } from 'redux-observable'
import { concat, from, interval } from 'rxjs'
import { map, mergeMap, tap } from 'rxjs/operators'

import {
  chatRoomsActionTypes,
  chatRoomsActionCreators,
  chatFeedsActionTypes,
  chatFeedsActionCreators,
  navListActionTypes,
  navListActionCreators,
} from '../../'
const { SET_NEW_CHATROOM, REMOVE_CHATROOM } = chatRoomsActionTypes
const {
  setNewChatFeed,
  removeChatFeed,
  epicChatFeed,
} = chatFeedsActionCreators
const { setNavItemProp } = navListActionCreators

import { unet } from '../../../network'

const setNewChatRoomEpic = action$ => action$.pipe(
  ofType(SET_NEW_CHATROOM),
  mergeMap( action => {
    const { orbitAddr } = action.payload
    return concat(
      from([action]).pipe(
        map(action => setNewChatFeed(action.payload)),
      ),
      from([action]).pipe(
        map(action => setNavItemProp(action.payload, 'orbitAddr')),
      ),
      from([action]).pipe(
        map(action => setNavItemProp(
          {...action.payload, initializing: false},
          'initializing',
        ))
      ),
    )
  }), //payload includes name and orbit -type -options -addr
)

const removeChatRoomEpic = (action$, state$) => action$.pipe(
  ofType(REMOVE_CHATROOM),
  mergeMap(({payload}) =>
    concat(
      from([1]).pipe(
        map(() => removeChatFeed(payload.orbitAddr))
      )
    )
  ),
)

const chatRoomsEpic = combineEpics(
  setNewChatRoomEpic,
  removeChatRoomEpic,
)

export { chatRoomsEpic }
