
import { combineEpics, ofType } from 'redux-observable'
import { concat, defer, from, fromEvent, merge } from 'rxjs'
import {
  filter,
  ignoreElements,
  map,
  mergeMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators'

import {
  orbitDbsActionTypes,
  orbitDbsActionCreators,
  orbitTmsActionCreators,
  navListActionCreators,
  usersSelectors,
} from '../../../'
const {
  OPEN_DB_ORBIT,
  CLOSE_DB_ORBIT,
  DROP_DB_ORBIT,
  SET_DB_ORBIT,
} = orbitDbsActionTypes
const {
  setDbOrbit,
  dispatchPurposedAction,
} = orbitDbsActionCreators
const { newTopicMonitor } = orbitTmsActionCreators
const { setNavItemProp } = navListActionCreators
const { getCurrentUserName } = usersSelectors

import { unet } from '../../../../network'

const userNameWithPrefix = (userName) => `${userName}@unet`

const orbitInstance = (userName) => unet.orbits[userNameWithPrefix(userName)]

const dbEventEmitter = (userName, orbitAddr) =>
  orbitInstance(userName).stores[orbitAddr].events

const dbEventKeys = [
  'replicated',
  'replicate',
  'replicate.progress',
  'load',
  'load.progress',
  'ready',
  'write',
  'closed',
]

const dbEventObservable = (userName, orbitAddr, action) =>
  merge(
    // spreads an array of fromEvent observables from keys
    // in dbEventKeys whos value are functions in action.payload
    ...dbEventKeys
    .filter((eventKey) => typeof action.payload[eventKey] === 'function')
    .map((eventKey, index) =>
      fromEvent(dbEventEmitter(userName, orbitAddr), eventKey)
      .pipe(
        // the action creator function
        map(() => action.payload[eventKey](userName, orbitAddr)),
      )
    )
  )

const openNamedDb = async (action) => {
  const { navItemId, orbitType, orbitOptions, userName } = action.payload
  const db = await unet.namedDb(
    userName,
    {
      name: navItemId,
      type: orbitType,
      options: orbitOptions,
    },
  )
  const dbAddr = db.address.toString()
  const actionWithOA = {
    ...action,
    payload:{...action.payload, orbitAddr: dbAddr},
  }
  // await topicMonitorReady(dbAddr)
  await db.load()
  return {actionWithOA, orbitAddr: dbAddr, userName }
}

const orbitDbEpic = action$ => action$.pipe(
  ofType(OPEN_DB_ORBIT),
  mergeMap( action =>
    defer(() => openNamedDb(action)).pipe(
      mergeMap( obj => {
        const { actionWithOA, orbitAddr, userName } = obj
        return concat(
          from([actionWithOA]).pipe(
            map(action => setNavItemProp(action.payload, 'initializing')),
          ),
          concat(
            merge(
              from([actionWithOA]).pipe(
                map(action => setDbOrbit(action)),
              ),
              from([actionWithOA]).pipe(
                map(action => newTopicMonitor(userName, action)),
              ),
              from([actionWithOA]).pipe(
                map(action => dispatchPurposedAction(action)),
              ),
            ),
            dbEventObservable(userName, orbitAddr, action),
          ),
        ).pipe(
          takeUntil(
            action$.pipe(
              ofType(CLOSE_DB_ORBIT, DROP_DB_ORBIT),
              filter(action => action.payload.orbitAddr === orbitAddr),
            )
          ),
        )
      })
    )
  ),
)

const dropDbOrbit = async (orbitInstance, orbitAddr) => {
  try {
    const db = orbitInstance.stores[orbitAddr]
    if (db) await db.drop
  } catch(e) {
    console.error(e)
  }
}

const dropDbOrbitEpic = (state, payload) => defer(() =>
  dropDbOrbit(
    orbitInstance(getCurrentUserName(state)),
    payload.orbitAddr,
  )
)


const dropDbEpic = (action$, state$) => action$.pipe(
  ofType(DROP_DB_ORBIT),
  withLatestFrom(state$),
  mergeMap(([{payload}, state]) => dropDbOrbitEpic(state, payload)),
  ignoreElements(),
)

const orbitDbsEpic = combineEpics(
  orbitDbEpic,
  dropDbEpic,
)

export { orbitDbsEpic }
