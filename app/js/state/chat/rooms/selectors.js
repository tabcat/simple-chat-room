
const getChatRoomsState = (state) => state.chat.rooms

const getChatRoom = (state) => (orbitAddr) => getChatRoomsState(state)[orbitAddr]

const getScroll = (state) => (orbitAddr) => getChatRoom(state)(orbitAddr).scroll

const chatRoomsSelectors = {
  getChatRoom,
  getScroll,
  getAutoScroll: (state) => (orbitAddr) => getScroll(state)(orbitAddr).autoScroll,
  getScrollTop: (state) => (orbitAddr) => getScroll(state)(orbitAddr).scrollTop,
  // getScrollTop: (state) => (orbitAddr) => getChatRoom(state)(orbitAddr).scroll.scrollTop,
  getInitializing: (state) => (orbitAddr) => getChatRoom(state)(orbitAddr).initializing,
}

export { chatRoomsSelectors }
