
const orbitTmsActionTypes = {
  PEER_JOIN_TOPIC: 'PEER_JOIN_TOPIC',
  PEER_LEAVE_TOPIC: 'PEER_LEAVE_TOPIC',
  NEW_TOPIC_MONITOR: 'NEW_TOPIC_MONITOR',
  SET_TOPIC_MONITOR: 'SET_TOPIC_MONITOR',
}
const {
  PEER_JOIN_TOPIC,
  PEER_LEAVE_TOPIC,
  NEW_TOPIC_MONITOR,
  // SET_TOPIC_MONITOR,
} = orbitTmsActionTypes

const orbitTmsActionCreators = {
  peerJoinTopic: (orbitAddr, peer) =>
    ({ type: PEER_JOIN_TOPIC, payload:{orbitAddr, peer} }),
  peerLeaveTopic: (orbitAddr, peer) =>
    ({ type: PEER_LEAVE_TOPIC, payload:{orbitAddr, peer} }),
  newTopicMonitor: (userName, action) =>
    ({ type: NEW_TOPIC_MONITOR, payload:{ ...action.payload, userName } }),
  // setTopicMonitor: (orbitAddr) =>
  //   ({ type: SET_TOPIC_MONITOR, payload:{orbitAddr} }),
}

export { orbitTmsActionTypes, orbitTmsActionCreators }
