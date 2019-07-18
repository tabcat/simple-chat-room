
import { combineEpics, ofType, } from 'redux-observable'
import { concat, defer, from, fromEvent, merge } from 'rxjs'
import { filter, map, mergeMap, tap, takeUntil } from 'rxjs/operators'
import {
  orbitTmsActionTypes,
  orbitTmsActionCreators,
  orbitDbsActionTypes,
} from '../../../'

const { NEW_TOPIC_MONITOR } = orbitTmsActionTypes
const {
  peerJoinTopic,
  peerLeaveTopic,
} = orbitTmsActionCreators
const { CLOSE_DB_ORBIT, DROP_DB_ORBIT } = orbitDbsActionTypes

import { unet } from '../../../../network'

const orbitInstance = (userName) =>
  unet.orbits[unet.userNameWithPrefix(userName)]

const roomTopicMonitor = (userName, orbitAddr) => {
  return !!orbitInstance(userName)._pubsub._subscriptions[orbitAddr]
    ? orbitInstance(userName)._pubsub._subscriptions[orbitAddr].topicMonitor
    : console.error('topicMonitor doesnt exist yet')
}

const wait = ms => new Promise((resolve) => setTimeout(resolve, ms))

// const tmIsReady = async (userName, orbitAddr) => {
//   return !!orbitInstance(userName)._pubsub._subscriptions[orbitAddr]
// }
//
// const topicMonitorReady = async (userName, orbitAddr) => {
//   const ready = await tmIsReady(userName, orbitAddr)
//   if (ready) {
//     return true
//   } else {
//     await wait(50)
//     return await topicMonitorReady(userName, orbitAddr)
//   }
// }

const topicMonitorObservable = (userName, orbitAddr) => {
  return merge(
    fromEvent(roomTopicMonitor(userName, orbitAddr), 'join')
      .pipe(
        tap((peer) =>
          console.log(`peer ${peer} joined ${orbitAddr.split('/')[2]}`)),
        map(peer => peerJoinTopic(orbitAddr, peer)),
      ),
    fromEvent(roomTopicMonitor(userName, orbitAddr), 'leave')
      .pipe(
        tap((peer) =>
          console.log(`peer ${peer} left ${orbitAddr.split('/')[2]}`)),
        map(peer => peerLeaveTopic(orbitAddr, peer)),
      ),
  )
}

const orbitTmsEpic = action$ => action$.pipe(
  ofType(NEW_TOPIC_MONITOR),
  mergeMap((action) => {
    const { userName, orbitAddr } = action.payload
    return topicMonitorObservable(userName, orbitAddr).pipe(
      takeUntil(
        action$.pipe(
          ofType(CLOSE_DB_ORBIT, DROP_DB_ORBIT),
          filter(action => action.payload.orbitAddr === orbitAddr),
        )
      )
    )
  }),
)

export { orbitTmsEpic }
