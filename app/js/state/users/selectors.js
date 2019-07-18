
const getUsersState = (state) => state.users

const getLocalUsers = (state) => getUsersState(state).localUsers
const getCurrentUser = (state) => getUsersState(state).currentUser

const usersSelectors = {
  getLocalUsers,
  getCurrentUser,
  getCurrentUserName: (state) => getCurrentUser(state).name,
  getCurrentUserId: (state) => getCurrentUser(state).identity,
}

export { usersSelectors }
