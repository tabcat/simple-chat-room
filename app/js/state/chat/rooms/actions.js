
const chatRoomsActionTypes = {
  SET_NEW_CHATROOM:'SET_NEW_CHATROOM',
  REMOVE_CHATROOM: 'REMOVE_CHATROOM',
  SET_CHATROOM_READY: 'SET_CHATROOM_READY',
  SET_CHATROOM_SCROLL: 'SET_CHATROOM_SCROLL',
  SET_CHAT_ROOMS_STATE: 'SET_CHAT_ROOMS_STATE',
}
const {
  SET_NEW_CHATROOM,
  REMOVE_CHATROOM,
  SET_CHATROOM_READY,
  SET_CHATROOM_SCROLL,
  SET_CHAT_ROOMS_STATE,
} = chatRoomsActionTypes

const chatRoomsActionCreators = {
  setNewChatRoom: (payload) => ({ type:SET_NEW_CHATROOM, payload  }),
  removeChatRoom: (navItem) =>
    ({ type:REMOVE_CHATROOM, payload:{ orbitAddr:navItem.props.orbitAddr } }),
  setChatRoomReady: (orbitAddr) => ({ type: SET_CHATROOM_READY, payload:{orbitAddr} }),
  setScroll: (orbitAddr, autoScroll, scrollTop) => ({
    type: SET_CHATROOM_SCROLL,
    payload:{orbitAddr, scroll:{autoScroll, scrollTop}}
  }),
  setChatRoomsState: (state) =>
    ({ type:SET_CHAT_ROOMS_STATE, payload:{ state } }),
}

export { chatRoomsActionTypes, chatRoomsActionCreators }
