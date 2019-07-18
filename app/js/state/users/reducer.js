
import { usersActionTypes } from '../'
const {
  LOGIN_USER,
  LOGOUT_USER,
  CREATE_USER,
  REQ_LOAD_LOCAL_USERS,
  LOAD_LOCAL_USERS,
  REQ_LOGIN_USER,
} = usersActionTypes

const INITIAL_STATE = {
  localUsers: null,
  currentUser: 0,
}

function usersReducer(state = INITIAL_STATE, action) {
  const { payload } = action
  switch (action.type) {
    case LOAD_LOCAL_USERS:
      return { ...state, localUsers:{...payload.localUsers} }
    case LOGIN_USER:
      return { ...state, currentUser:{...payload.user} }
    case LOGOUT_USER:
      return { ...state, currentUser:0 }
    case REQ_LOGIN_USER:
      return { ...state, currentUser:1 }
    default:
      return state;
  }
}

export { usersReducer }
