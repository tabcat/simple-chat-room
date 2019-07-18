const ethActionTypes = {
  SET_ADDR: 'SET_ADDR',
  WEB3_SUCCESS: 'WEB3_SUCCESS',
  WEB3_FAIL: 'WEB3_FAIL',
  WEB3_DISABLED: 'WEB3_DISABLED',
};
const {
  SET_ADDR,
  WEB3_SUCCESS,
  WEB3_FAIL,
  WEB3_DISABLED,
} = ethActionTypes;

const ethActionCreators = {
  setEthAddr: addr => ({ type: SET_ADDR, addr }),
  setWeb3Status: status => ({ type: status })
};

export { ethActionTypes, ethActionCreators }
