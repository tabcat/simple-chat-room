
import { combineEpics, ofType } from 'redux-observable'
import { concat, defer, from, fromEvent, merge } from 'rxjs'
import {
  auditTime,
  filter,
  ignoreElements,
  map,
  mergeMap,
  pairwise,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators'
import {
  usersActionTypes,
  usersActionCreators,
  usersSelectors,
  navDrawerActionCreators,
  navListActionCreators,
  chatRoomsActionTypes,
  chatRoomsActionCreators,
  chatFeedsActionCreators,
  orbitDbsActionTypes,
} from '../'
import { unet } from '../../network'

const {
  LOGIN_USER,
  LOGOUT_USER,
  CREATE_USER,
  REQ_LOAD_LOCAL_USERS,
  LOAD_LOCAL_USERS,
  REQ_LOGIN_USER,
} = usersActionTypes
const {
  reqLoadLocalUsers,
  loadLocalUsers,
  loginUser,
} = usersActionCreators
const { getCurrentUserName } = usersSelectors
const { setNavDrawerState } = navDrawerActionCreators
const { setNavListState, setNavItemProp } = navListActionCreators
const { setChatRoomsState } = chatRoomsActionCreators
const { setChatFeedsState, reqChatFeedUpdate } = chatFeedsActionCreators
const { OPEN_DB_ORBIT } = orbitDbsActionTypes
const { SET_NEW_CHATROOM } = chatRoomsActionTypes

var levelup = require('levelup')
var leveljs = require('level-js')
var pull = require('pull-stream/pull')
var toPull = require('stream-to-pull-stream')

const Identities = require('orbit-db-identity-provider')

const str2Buffer = (string) => new TextEncoder().encode(string)
const buffer2Str = (buffer) => new TextDecoder().decode(buffer)

const obj2Buffer = (obj) =>
	str2Buffer(
    JSON.stringify(
      obj
    )
  )

const buffer2Obj = (buffer) =>
	JSON.parse(
		buffer2Str(
			buffer
		)
	)

const openLevelDb = (dbKey, options) =>
  levelup(leveljs(dbKey, options))

const localUsersDb = openLevelDb('unet/local-users')
const stateBackupPrefix = (userName) => `unet/stateBackup/${userName}`
const userStateDb = (userName) => openLevelDb(stateBackupPrefix(userName))

const getLocalUsersObj = async () => {
  try{
    return await loadPersistedState(localUsersDb)
  } catch (e) {
    console.log(e)
    return {}
  }
}

const deleteLocalUser = async (payload) => {
  const { userName } = payload
  await localUsersDb.del(userName)
  const req = indexedDB.deleteDatabase(stateBackupPrefix(userName))
  const errMsg =
    `Couldn't delete user ${userName}'s database, delete
    ${stateBackupPrefix(userName)} IDB manually`
  req.onsuccess = () =>
    console.log(`user ${userName}'s IDB deleted successfully`)
  req.onerror = () => console.log(errMsg)
  req.onblocked = () => console.log(errMsg)
}

const setLocalUser = async (payload) => {
  const { userName, identity, userVal } = payload
  const id = !!identity
    ? identity
    : await Identities.createIdentity({ id:unet.userNameWithPrefix(userName) })
  const user = { name:userName, identity:id }
  await localUsersDb.put(userName, obj2Buffer(!!userVal ? userVal : user))
}

const keysOnObj = (obj, keys) => {
  return keys.length === 0
    ? obj
    : typeof obj[keys[0]] !== 'undefined'
      ? keysOnObj(obj[keys[0]], keys.filter((key, index) => index !== 0))
      : NaN
}

const arraysEqual = (arr1, arr2) =>
  arr1.length === arr2.length &&
  arr1.filter((val, index) => val !== arr2[index]).length === 0

const subtractArrayKeys = (arr1, arr2) =>
	arr1.filter((key1) => arr2.filter((key2) => key1 === key2).length === 0 )

const compareState = (prevState, state, keys = []) => {
  const prevObj = keysOnObj(prevState, keys)
  const currentObj = keysOnObj(state, keys)
  const isObject = (obj) => !!obj && typeof obj === 'object'

  if (isObject(prevObj) || isObject(currentObj)) {

    if (Array.isArray(prevObj) || Array.isArray(currentObj)) {
      return Array.isArray(prevObj) && Array.isArray(currentObj)
		  ? arraysEqual(prevObj, currentObj)
        ? undefined
        : [keys]
		  : [keys]
    }

    const prevObjKeys =
      Object.keys(isObject(prevObj) ? prevObj : [])
    const currentObjKeys =
      Object.keys(isObject(currentObj) ? currentObj : [])

	  const combinedKeys = [...new Set([
        ...prevObjKeys,
        ...currentObjKeys,
    ])]

	  return keys.length === 0
	  ? {
	    del: subtractArrayKeys(prevObjKeys, currentObjKeys).flatMap((key) =>
    		compareState(prevState, state, [...keys, key]))
    		.filter((val) => val !== undefined),
		  put: currentObjKeys.flatMap((key) =>
    		compareState(prevState, state, [...keys, key]))
    		.filter((val) => val !== undefined),
	  }
	  :	combinedKeys.length === 0
      ? prevObj && currentObj ? undefined : [keys]
      : combinedKeys.flatMap((key) =>
      	compareState(prevState, state, [...keys, key]))
      	.filter((val) => val !== undefined)

  } else if (prevObj === currentObj) {
	  return undefined
  } else {
    return [keys]
  }
}

const prunedObj = (obj, keptKeys) =>
  Object.keys(obj).filter((key1) =>
  keptKeys.filter((key2) => key1 === key2).length === 1)
  .reduce((accu, key) => ({ ...accu, [key]:obj[key] }), {})

const putDbRecord = async (db, state, keys) =>
  await db.put(keys, obj2Buffer(keysOnObj(state, keys)))

const delDbRecord = async (db, keys) => await db.del(keys)

const backedUpState = ['navigation']

const stateBackup = async (db, prevState, state) => {
  const changes = compareState(
    prunedObj(prevState, backedUpState),
    prunedObj(state, backedUpState),
  )
  await Promise.all(
    changes.put.map(async (keys) => await putDbRecord(db, state, keys))
  )
  await Promise.all(
    changes.del.map(async (keys) => await updateDbRecord(db, keys))
  )
}

const statePersistEpic = (action$, state$) => state$.pipe(
  auditTime(1*1000),
  pairwise(),
  mergeMap(([prevState, state]) => {
    const userName = getCurrentUserName(state)
    return merge(
      defer(() =>
        stateBackup(
          userStateDb(userName),
          prevState,
          state,
        )
      ).pipe(ignoreElements()),
    )
  }),
)

const loggedInEpic = (action$, state$) => merge(
  statePersistEpic(action$, state$),
)

const allKeys = (db) => new Promise((res, rej) => {
  pull(
    toPull(db.keyStream()),
    pull.map(buffer2Str),
    pull.collect((err, data) => !err ? res(data) : res(err)),
  )
})

const keyVals = async (db, allKeys) => await Promise.all(
  allKeys.map((key) => key.split(','))
  .map(async(key) => [key, buffer2Obj(await db.get(key))])
)

const updateNestedImmutable = (obj, locationKeys, value) => {
  return locationKeys.length === 1
  ? {
    ...obj,
    [locationKeys[0]]: value
  }
  : {
    ...obj,
    [locationKeys[0]]: updateNestedImmutable(
      !!obj[locationKeys[0]] ? obj[locationKeys[0]] : {},
      locationKeys.filter((key,index) => index !== 0),
      value,
    )
  }
}

const rebuildPersistedObj = (keyVals, state = {}) =>
keyVals.length === 0
  ? state
  : rebuildPersistedObj(
      keyVals.filter((key, index) => index !== 0),
      updateNestedImmutable(state, keyVals[0][0], keyVals[0][1]),
  )

const loadPersistedState = async (db) => {
  const rebuiltState = await rebuildPersistedObj(await keyVals(db, await allKeys(db)))
  return rebuiltState
}
const loadPersistedStateEpic = (userName) => defer(() =>
loadPersistedState(userStateDb(userName))).pipe(
  mergeMap((state) =>
    merge(
      from([1]).pipe(
        map(() => setNavDrawerState(state.navigation.navDrawer)),
      ),
      from([1]).pipe(
        map(() => setNavListState(state.navigation.navList)),
      ),
    )
  ),
)

const initPersistState = async (db, state) => {
  const dbKeys = await allKeys(db)
  if (dbKeys.length === 0) {
    await stateBackup(db, {}, state)
  }
}

const initPersistStateEpic = (state$, userName) => state$.pipe(
  mergeMap((state) =>
    defer(() => initPersistState(userStateDb(userName), state)),
  ),
  take(1),
  ignoreElements(),
)

const initLoadedNavList = (state, userName) => {
  const navList = state.navigation.navList
  const navListKeys = Object.keys(navList)
  const chatroomNavItems = navListKeys.filter((key) =>
    navList[key].componentName === 'chatroom')

  return from(chatroomNavItems).pipe(
    map((key) => {
      const navItem = navList[key]
      const { name, props, id } = navItem
      return setNavItemProp(
        {
          init: OPEN_DB_ORBIT,
          name,
          userName,
          navItemId: id,
          purpose: SET_NEW_CHATROOM,
          initializing: true,
          orbitType: props.orbitType,
          orbitOptions: props.orbitOptions,
          write: reqChatFeedUpdate,
          replicated: reqChatFeedUpdate,
        },
        'initializing'
      )
    }),
  )
}

const initLoadedStateEpic = (state$, userName) => from([1]).pipe(
  withLatestFrom(state$),
  mergeMap(([num, state]) => initLoadedNavList(state, userName)),
)

const loginUserEpic = (action$, state$) => action$.pipe(
  ofType(REQ_LOGIN_USER),
  switchMap(action =>
    concat(
      defer(() => unet.getOrbitInstance(action.payload.user.name)).pipe(
        ignoreElements(),
      ),
      initPersistStateEpic(state$, action.payload.user.name),
      loadPersistedStateEpic(action.payload.user.name),
      initLoadedStateEpic(state$, action.payload.user.name),
      from([1]).pipe(
        map(() => loginUser(action.payload.user))
      ),
      loggedInEpic(action$, state$)
    ).pipe(
      takeUntil(
        action$.pipe(
          ofType(LOGOUT_USER),
        )
      )
    )
  ),
)

const deleteUserEpic = action$ => action$.pipe(
  ofType(DELETE_USER),
  switchMap(({payload}) =>
    defer(() => removeLocalUser(payload)).pipe(
      map(()=> reqLoadLocalUsers()),
    )
  ),
)

const createUserEpic = action$ => action$.pipe(
  ofType(CREATE_USER),
  switchMap(({payload}) =>
    defer(() => setLocalUser(payload)).pipe(
      map(()=> reqLoadLocalUsers()),
    )
  ),
)

const localUsersEpic = (action$, state$) => merge(
    loginUserEpic(action$, state$),
    createUserEpic(action$),
  )

const usersEpic = (action$, state$) => action$.pipe(
  ofType(REQ_LOAD_LOCAL_USERS),
  switchMap(() =>
    defer(() => getLocalUsersObj()).pipe(
      mergeMap((localUsers) =>
        concat(
          from([localUsers]).pipe(
            map(localUsers => loadLocalUsers(localUsers)),
          ),
          localUsersEpic(action$, state$),
        )
      ),
    )
  ),
)

export { usersEpic }



// str2Buffer = (string) => new TextEncoder().encode(string)
// buffer2Str = (buffer) => new TextDecoder().decode(buffer)
//
// obj2Buffer = (obj) =>
//     str2Buffer(
//     JSON.stringify(
//       obj
//     )
//   )
//
// buffer2Obj = (buffer) =>
//     JSON.parse(
//         buffer2Str(
//             buffer
//         )
//     )
//
// keysOnObj = (obj, keys) => {
//   return keys.length === 0
//     ? obj
//     : typeof obj[keys[0]] !== 'undefined'
//       ? keysOnObj(obj[keys[0]], keys.filter((key, index) => index !== 0))
//       : NaN
// }
//
// arraysEqual = (arr1, arr2) =>
//   arr1.length === arr2.length &&
//   arr1.filter((val, index) => val !== arr2[index]).length === 0
//
// subtractArrayKeys = (arr1, arr2) =>
// 	arr1.filter((key1) => arr2.filter((key2) => key1 === key2).length === 0 )
//
//
//
// compareState = (prevState, state, keys = []) => {
//   const prevObj = keysOnObj(prevState, keys)
//   const currentObj = keysOnObj(state, keys)
//   const isObject = (obj) => !!obj && typeof obj === 'object'
//
//   if (isObject(prevObj) || isObject(currentObj)) {
//
//     if (Array.isArray(prevObj) || Array.isArray(currentObj)) {
//       return Array.isArray(prevObj) && Array.isArray(currentObj)
// 		  ? arraysEqual(prevObj, currentObj)
//         ? undefined
//         : [keys]
// 		  : [keys]
//     }
//
//     const prevObjKeys =
//       Object.keys(isObject(prevObj) ? prevObj : [])
//     const currentObjKeys =
//       Object.keys(isObject(currentObj) ? currentObj : [])
//
// 	  const combinedKeys = [...new Set([
//         ...prevObjKeys,
//         ...currentObjKeys,
//     ])]
//
// 	  return keys.length === 0
// 	  ? {
// 	    del: subtractArrayKeys(prevObjKeys, currentObjKeys).flatMap((key) =>
//     		compareState(prevState, state, [...keys, key]))
//     		.filter((val) => val !== undefined),
// 		  put: currentObjKeys.flatMap((key) =>
//     		compareState(prevState, state, [...keys, key]))
//     		.filter((val) => val !== undefined),
// 	  }
// 	  :	combinedKeys.length === 0
//       ? prevObj && currentObj ? undefined : [keys]
//       : combinedKeys.flatMap((key) =>
//       	compareState(prevState, state, [...keys, key]))
//       	.filter((val) => val !== undefined)
//
//   } else if (prevObj === currentObj) {
// 	  return undefined
//   } else {
//     return [keys]
//   }
// }
//
// updateNestedImmutable = (obj, locationKeys, value) => {
//   return locationKeys.length === 1
//   ? {
//     ...obj,
//     [locationKeys[0]]: value
//   }
//   : {
//     ...obj,
//     [locationKeys[0]]: updateNestedImmutable(
//       !!obj[locationKeys[0]] ? obj[locationKeys[0]] : {},
//       locationKeys.filter((key,index) => index !== 0),
//       value,
//     )
//   }
// }
//
// rebuildPersistedObj = (keyVals, state = {}) =>
//   keyVals.length === 0
//     ? state
//     : rebuildPersistedObj(
//         keyVals.filter((key, index) => index !== 0),
//         updateNestedImmutable(state, keyVals[0][0], keyVals[0][1])
//       )
//
//
// navigationState = JSON.parse('{"navDrawer":{"selectedNavItem":"public","drawerOpen":false},"navList":{"root":{"componentName":null,"props":null,"open":true,"children":["profile","chat"],"action":null,"next":null,"id":"root","type":"expandable","name":"root","title":"root","parentId":null,"prev":null},"profile":{"componentName":"profile","props":{},"open":null,"children":null,"action":null,"next":"chat","id":"profile","type":"link","name":"profile","title":"Profile","parentId":"root","prev":null},"chat":{"componentName":null,"props":null,"open":true,"children":["createChat","public"],"action":null,"next":null,"id":"chat","type":"expandable","name":"chat","title":"Chat","parentId":"root","prev":"profile"},"createChat":{"componentName":null,"props":null,"open":null,"children":null,"action":{"type":"SET_MODAL_TYPE","payload":{"modalType":"createChatroom"}},"next":"public","id":"createChat","type":"createable","name":"create chat","title":"Create Chatroom","parentId":"chat","prev":null},"public":{"componentName":"chatroom","props":{"name":"public","orbitType":"feed","orbitOptions":{"accessController":{"write":["*"]}},"orbitAddr":null,"initializing":false},"open":null,"children":null,"action":null,"next":null,"id":"public","type":"link","name":"public","title":"public","parentId":"chat","prev":"createChat"}}}')
//
// allKeys = compareState({}, navigationState)
// allPutKeys = allKeys.put
// allDelKeys = allKeys.del
// keyVals = allPutKeys.map((keys) => [keys, keysOnObj(navigationState, keys)] )
//
// rebuiltState = rebuildPersistedObj(keyVals, {})
//
// console.log(navigationState)
// console.log(rebuiltState)
// console.log(compareState(navigationState, rebuiltState))
