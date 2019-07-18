
import { orbitTmsActionTypes } from '../../../'
const {
  PEER_JOIN_TOPIC,
  PEER_LEAVE_TOPIC,
  SET_TOPIC_MONITOR,
  NEW_TOPIC_MONITOR,
} = orbitTmsActionTypes

const setTopicMonitorState = (state, payload) => ({
  ...state,
  [payload.orbitAddr]: !!state[payload.orbitAddr]
    ? state[payload.orbitAddr]
    : [],
})

const INITIAL_STATE = {}

function orbitTmsReducer(state = INITIAL_STATE, action) {
  const { payload } = action
  switch (action.type) {
    case PEER_JOIN_TOPIC:
      return {
        ...state,
        [payload.orbitAddr]:[...state[payload.orbitAddr], payload.peer]}
    case PEER_LEAVE_TOPIC:
      return {
        ...state,
        [payload.orbitAddr]: [
          ...state[payload.orbitAddr].filter(peer => peer !== payload.peer)
        ]
      }
    case NEW_TOPIC_MONITOR:
      return setTopicMonitorState(state, payload)
    case SET_TOPIC_MONITOR:
      return setTopicMonitorState(state, payload)
    default:
      return state;
  }
}

export { orbitTmsReducer }
