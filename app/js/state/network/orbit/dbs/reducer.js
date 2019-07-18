
import { orbitDbsActionTypes } from '../../../'
const {
  SET_DB_ORBIT,
} = orbitDbsActionTypes

const INITIAL_STATE = {}

function orbitDbsReducer(state = INITIAL_STATE, action) {
  const { payload } = action
  switch (action.type) {
    case SET_DB_ORBIT:
      return {
        ...state,
        [payload.orbitAddr]:{
          name: payload.name,
          type: payload.orbitType,
          options: payload.orbitOptions,
          orbitAddr: payload.orbitAddr,
        }
      }
    default:
      return state;
  }
}

export { orbitDbsReducer }
