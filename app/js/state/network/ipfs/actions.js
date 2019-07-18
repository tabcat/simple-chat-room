const SubnameActionTypes = {
  INITIALIZE_SNET: 'INITIALIZE_SNET_STATE',
  UPDATE_PROFILE: 'UPDATE_PROFILE',

}
const {
  INITIALIZE_SNET,
  UPDATE_PROFILE,
} = SubnameActionTypes

const SubnameActionCreators = {
  initializeSnetState: (snet) => ({ type: INITIALIZE_SNET, payload:{ snet } }),
  updateProfile: (fields) => ({ type: UPDATE_PROFILE, payload:{ fields } })
}

export { SubnameActionTypes, SubnameActionCreators }
