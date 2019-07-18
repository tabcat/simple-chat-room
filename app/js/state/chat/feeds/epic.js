
import { combineEpics, ofType } from 'redux-observable'
import { concat, defer, from, fromEvent, interval, merge } from 'rxjs'
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators'

import {
  chatFeedsActionTypes,
  chatFeedsActionCreators,
  chatRoomsActionTypes,
  navListActionTypes,
  navListActionCreators,
  orbitDbsActionTypes,
} from '../../'
const {
  SET_NEW_CHATFEED,
  REQ_UPDATE_CHATFEED,
} = chatFeedsActionTypes
const { updateChatFeed } = chatFeedsActionCreators
const { REMOVE_CHATROOM } = chatRoomsActionTypes
const { setNavItemProp } = navListActionCreators
const { CLOSE_DB_ORBIT } = orbitDbsActionTypes

import { unet } from '../../../network'

const orbitInstance = (userName) =>
  unet.orbits[unet.userNameWithPrefix(userName)]

const msgFilter = (msgs) => msgs.map((msg) =>
  ({
    hash: msg.hash,
    key: msg.key,
    payload: msg.payload.value,
    recieved: `${window.Date.now()}`,
  })
)

const updatedChatFeed = (userName, orbitAddr) =>
  msgFilter(
    orbitInstance(userName).stores[orbitAddr].iterator({ limit: 100 }).collect()
  )

const updateFeedEpic = (action$, state$) => action$.pipe(
  ofType(REQ_UPDATE_CHATFEED),
  map((action) => {
    const { userName, orbitAddr } = action.payload
    return updateChatFeed(orbitAddr, updatedChatFeed(userName, orbitAddr))
  })
)

const feedEpic = (action$, state$) => action$.pipe(
  ofType(SET_NEW_CHATFEED),
  mergeMap(action => {
    const { orbitAddr, userName } = action.payload
    return concat(
      from([action]).pipe(
        map(action =>
          updateChatFeed(orbitAddr, updatedChatFeed(userName, orbitAddr)))
      ),
      interval(30*1000).pipe(
        map(() =>
          updateChatFeed(orbitAddr, updatedChatFeed(userName, orbitAddr)))
      ),
    ).pipe(
      takeUntil(
        action$.pipe(
          ofType(REMOVE_CHATROOM),
          filter(action => action.payload.orbitAddr === orbitAddr),
        )
      ),
    )
  })
)

// const chatFeedsEpic = (action$, state$) => action$.pipe(
//   map(()=>
//     merge(
//       feedEpic(action$),
//       updateFeedEpic(action$, state$),
//     )
//   ),
// )

const chatFeedsEpic = combineEpics(
  feedEpic,
  updateFeedEpic,
)

export { chatFeedsEpic }
