import { SubnameActionTypes } from './actions'
const {
  INITIALIZE_SNET,
  UPDATE_PROFILE,
} = SubnameActionTypes

function initializedSnetState(state, snet) {
  const { profile } = snet
  const name = !!profile.get('name')
    ? profile.get('name')
    : null

  return {
    ...state,
    address: profile.address,
    identity: profile.get('identity'),
    name
  }
}

const INITIAL_STATE = {  }

function SubnameReducer(state = INITIAL_STATE, action) {
  const { payload } = action
  switch (action.type) {
    case INITIALIZE_SNET:
      initializedSnetState(state, payload.snet)
    case UPDATE_PROFILE:

    default:
      return state
  }
}

export { SubnameReducer }
