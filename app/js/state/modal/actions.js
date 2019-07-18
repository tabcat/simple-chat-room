
const modalActionTypes = {
  SET_MODAL_OPENNESS: 'SET_MODAL_OPENNESS',
  SET_MODAL_TYPE: 'SET_MODAL_TYPE',
  SET_MODAL_TYPE_FIELDS: 'SET_MODAL_TYPE_FIELDS',
  MODAL_CONFIRM: 'MODAL_CONFIRM',
  RESET_MODAL: 'RESET_MODAL'
}
const {
  SET_MODAL_OPENNESS,
  SET_MODAL_TYPE,
  SET_MODAL_TYPE_FIELDS,
  MODAL_CONFIRM,
  RESET_MODAL,
} = modalActionTypes

const modalActionCreators = {
  setModalOpen: modalOpen => ({ type: SET_MODAL_OPENNESS, payload: {modalOpen} }),
  setModalType: modalType => ({ type: SET_MODAL_TYPE, payload:{ modalType } }),
  setModalTypeFields: (modalType, changes) =>
    ({ type:SET_MODAL_TYPE_FIELDS, payload:{ modalType, changes } }),
  modalConfirm: (modalAction) => ({
    type: MODAL_CONFIRM,
    payload:{
      modalAction
    }
  }),
  resetModal: (modalType) => ({ type: RESET_MODAL, payload:{ modalType } })
}

export { modalActionTypes, modalActionCreators }
