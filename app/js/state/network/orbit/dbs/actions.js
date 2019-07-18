
const orbitDbsActionTypes = {
  OPEN_DB_ORBIT: 'OPEN_DB_ORBIT',
  CLOSE_DB_ORBIT: 'CLOSE_DB_ORBIT',
  DROP_DB_ORBIT: 'DROP_DB_ORBIT',
  SET_DB_ORBIT: 'SET_DB_ORBIT',
}
const {
  OPEN_DB_ORBIT,
  CLOSE_DB_ORBIT,
  DROP_DB_ORBIT,
  SET_DB_ORBIT,
} = orbitDbsActionTypes

const orbitDbsActionCreators = {
  openDbOrbit: (payload) => ({ type: OPEN_DB_ORBIT, payload }),
  setDbOrbit: (action) => ({ type: SET_DB_ORBIT, payload:{...action.payload} }),
  dropDbOrbit: (navItem) =>
    ({ type:DROP_DB_ORBIT, payload:{ orbitAddr:navItem.props.orbitAddr } }),
  dispatchPurposedAction: (action) =>
    ({ type: action.payload.purpose, payload:{...action.payload} }),
}

export { orbitDbsActionTypes, orbitDbsActionCreators }
