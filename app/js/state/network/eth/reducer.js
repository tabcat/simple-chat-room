import { ethActionTypes } from './actions';
const {
  SET_ADDR,
  WEB3_SUCCESS,
  WEB3_FAIL,
  WEB3_DISABLED,
} = ethActionTypes;

const INITIAL_STATE = {
  web3Connected: false,
  currentAcc: null,
  networkType: null,
}

function ethReducer(state = INITIAL_STATE, action) {
  let { currentAcc, networkType } = action;
  switch (action.type) {
    case SET_ADDR:
      return { ...state, currentAcc: action.addr };
    case WEB3_SUCCESS:
      return { ...state, web3Connected: true, currentAcc, networkType };
    case WEB3_DISABLED:
      return INITIAL_STATE;
    // case 'WEB3_ENABLED':
    //   return { ...state, web3: false, currentAcc: 'web3 not injected', networkType };
    case WEB3_FAIL:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export { ethReducer }
