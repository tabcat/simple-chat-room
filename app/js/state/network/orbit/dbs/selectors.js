
const getOrbitDbsState = (state) => state.network.orbit.dbs

const orbitDbsSelectors = {
  getDb: (state) => (orbitAddr) => getOrbitDbsState(state)[orbitAddr],
}

export { orbitDbsSelectors }
