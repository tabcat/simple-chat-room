
import { chatRoomsActionTypes } from '../../'
const {
  SET_NEW_CHATROOM,
  REMOVE_CHATROOM,
  SET_CHATROOM_READY,
  SET_CHATROOM_SCROLL,
  SET_CHAT_ROOMS_STATE,
} = chatRoomsActionTypes


const setNewChatRoom = (payload) => ({
  name: payload.name,
  navItemId: payload.navItemId,
  orbitAddr: payload.orbitAddr,
  scroll: {
    autoScroll: true,
    scrollTop: null,
  },
})

const setChatRoomReady = (state, payload) => {
  return { ...state[payload.orbitAddr], initializing: false }
}

const prunedObj = (obj, removedKeys) =>
  Object.keys(obj).filter((key1) =>
  removedKeys.filter((key2) => key1 === key2).length !== 1)
  .reduce((accu, key) => ({ ...accu, [key]:obj[key] }), {})

const removeChatRoom = (state, orbitAddr) => prunedObj(state, [orbitAddr])

const INITIAL_STATE = {}

function chatRoomsReducer(state = INITIAL_STATE, action) {
  const { payload } = action
  switch (action.type) {
    case SET_NEW_CHATROOM:
      return { ...state, [payload.orbitAddr]: setNewChatRoom(payload) }
    case REMOVE_CHATROOM:
      return removeChatRoom(state, payload.orbitAddr)
    case SET_CHATROOM_READY:
      return { ...state, [payload.orbitAddr]: setChatRoomReady(state, payload) }
    case SET_CHATROOM_SCROLL:
      return {
        ...state,
        [payload.orbitAddr]:{...state[payload.orbitAddr], scroll: payload.scroll}
      }
    case SET_CHAT_ROOMS_STATE:
      return { ...payload.state }
    default:
      return state;
  }
}

export { chatRoomsReducer }
