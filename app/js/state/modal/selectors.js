
const getModalState = (state) => state.modal

const modalSelectors = {
  modalOpen: (state) => getModalState(state).modalOpen,
  modalType: (state) => getModalState(state).modalType,
  modalTypeState: (state, modalType) => getModalState(state)[modalType],
}

export { modalSelectors }
