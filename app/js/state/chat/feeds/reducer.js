
import { chatFeedsActionTypes } from '../../'
const {
  SET_NEW_CHATFEED,
  REMOVE_CHATFEED,
  UPDATE_CHATFEED,
  SET_CHAT_FEEDS_STATE,
} = chatFeedsActionTypes

const prunedObj = (obj, removedKeys) =>
  Object.keys(obj).filter((key1) =>
  removedKeys.filter((key2) => key1 === key2).length !== 1)
  .reduce((accu, key) => ({ ...accu, [key]:obj[key] }), {})

const removeChatFeed = (state, orbitAddr) => prunedObj(state, [orbitAddr])

const INITIAL_STATE = {}

function chatFeedsReducer(state = INITIAL_STATE, action) {
  const { payload } = action
  switch (action.type) {
    case SET_NEW_CHATFEED:
      return { ...state, [payload.orbitAddr]:[] }
    case REMOVE_CHATFEED:
      return removeChatFeed(state, payload.orbitAddr)
    case UPDATE_CHATFEED:
      return { ...state, [payload.orbitAddr]:[...payload.newChatFeed]}
    case SET_CHAT_FEEDS_STATE:
      return { ...payload.state }
    default:
      return state;
  }
}

export { chatFeedsReducer }
