
const usersActionTypes = {
  LOGIN_USER: 'LOGIN_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  CREATE_USER: 'CREATE_USER',
  DELETE_USER: 'DELETE_USER',
  REQ_LOAD_LOCAL_USERS: 'REQ_LOAD_LOCAL_USERS',
  LOAD_LOCAL_USERS: 'LOAD_LOCAL_USERS',
  REQ_LOGIN_USER: 'REQ_LOGIN_USER',
}
const {
  LOGIN_USER,
  LOGOUT_USER,
  CREATE_USER,
  DELETE_USER,
  REQ_LOAD_LOCAL_USERS,
  LOAD_LOCAL_USERS,
  REQ_LOGIN_USER,
} = usersActionTypes

const usersActionCreators = {
  loginUser: (user) => ({ type:LOGIN_USER, payload:{ user } }),
  logoutUser: (user) => ({ type:LOGOUT_USER, payload:{ user } }),
  createUser: (userConfig) => ({ type:CREATE_USER, payload:{ ...userConfig } }),
  deleteUser: (userName) => ({ type:DELETE_USER, payload:{ userName }}),
  reqLoadLocalUsers: () => ({ type:REQ_LOAD_LOCAL_USERS }),
  loadLocalUsers: (localUsers) => ({ type:LOAD_LOCAL_USERS, payload:{ localUsers } }),
  reqLoginUser: (user) => ({ type:REQ_LOGIN_USER, payload:{ user } }),
}

export { usersActionTypes, usersActionCreators }
