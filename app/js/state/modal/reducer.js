
import { modalActionTypes } from '../'
const {
  SET_MODAL_OPENNESS,
  SET_MODAL_TYPE,
  SET_MODAL_TYPE_FIELDS,
  MODAL_CONFIRM,
  RESET_MODAL,
} = modalActionTypes

const INITIAL_STATE = {
  modalType: null,
  modalOpen: false,
}

const updateModalTypeField = (state, payload) => {
  const { modalType, changes } = payload
  const modalTypeState = !!state[modalType]
    ? state[modalType]
    : {}
  return { ...state, [modalType]:{ ...modalTypeState, ...changes } }
}

const persistModalState = (state, payload) => {
  const { modalType } = payload
  const newState = !!state[modalType]
    ? { ...state, modalOpen:true }
    : { ...state, modalOpen:true, modalType, [modalType]:{} }
  return newState
}

function modalReducer(state = INITIAL_STATE, action) {
  const { payload } = action
   switch (action.type) {
    case SET_MODAL_OPENNESS:
      return { ...state, modalOpen: payload.modalOpen }
    case SET_MODAL_TYPE:
      return persistModalState(state, payload)
    case SET_MODAL_TYPE_FIELDS:
      return updateModalTypeField(state, payload)
    case MODAL_CONFIRM:
    case RESET_MODAL:
      return { ...state, modalOpen:false, [payload.modalType]:null }
    default:
      return { ...state }
  }
}

export { modalReducer }
