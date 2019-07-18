import { appbarActionTypes } from './actions'
const {
  SET_APPBAR_TITLE
} = appbarActionTypes

const INITIAL_STATE = {}

function appbarReducer(state = INITIAL_STATE, action) {
  const { payload } = action
  switch (action.type) {
    case SET_APPBAR_TITLE:
      return { ...state, title: payload.title }
    default:
      return state;
  }
}

export { appbarReducer }
