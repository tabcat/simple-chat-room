
const chatFeedsActionTypes = {
  SET_NEW_CHATFEED: 'SET_NEW_CHATFEED',
  REMOVE_CHATFEED: 'REMOVE_CHATFEED',
  UPDATE_CHATFEED: 'UPDATE_CHATFEED',
  REQ_UPDATE_CHATFEED: 'REQ_UPDATE_CHATFEED',
  SET_CHAT_FEEDS_STATE: 'SET_CHAT_FEEDS_STATE',
}
const {
  SET_NEW_CHATFEED,
  REMOVE_CHATFEED,
  UPDATE_CHATFEED,
  REQ_UPDATE_CHATFEED,
  SET_CHAT_FEEDS_STATE,
} = chatFeedsActionTypes

const updateChatFeed = (orbitAddr, newChatFeed) => ({
  type: UPDATE_CHATFEED,
  payload:{ orbitAddr, newChatFeed }
})

const chatFeedsActionCreators = {
  setNewChatFeed: (payload) => ({ type: SET_NEW_CHATFEED, payload }),
  removeChatFeed: (orbitAddr) =>
    ({ type:REMOVE_CHATFEED, payload:{ orbitAddr }}),
  updateChatFeed: (orbitAddr, newChatFeed) =>
    ({ type: UPDATE_CHATFEED, payload:{ orbitAddr, newChatFeed } }),
  reqChatFeedUpdate: (userName, orbitAddr) =>
    ({ type: REQ_UPDATE_CHATFEED, payload:{ userName, orbitAddr } }),
  setChatFeedsState: (state) =>
    ({ type:SET_CHAT_FEEDS_STATE, payload:{ state } }),
}

export { chatFeedsActionTypes, chatFeedsActionCreators }
