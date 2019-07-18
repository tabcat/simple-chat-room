
const getChatFeedsState = (state) => state.chat.feeds

const chatFeedsSelectors = {
  getChatFeed: (state) => (orbitAddr) => getChatFeedsState(state)[orbitAddr],
}

export { chatFeedsSelectors }
