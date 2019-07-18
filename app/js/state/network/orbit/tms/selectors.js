
const getOrbitTmsState = (state) => state.network.orbit.tms

const orbitTmsSelectors = {
  getTopicMonitor: (state) => (orbitAddr) => getOrbitTmsState(state)[orbitAddr],
}

export { orbitTmsSelectors }
