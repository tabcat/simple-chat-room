
import { connect } from 'react-redux'
import { modalSelectors, modalActionCreators } from '../../state'

import ModalDummy from '../dummies/modalDummy'

const mapStateToProps = function(state) {
  const modalType = modalSelectors.modalType(state)
  return {
    modalType,
    modalOpen: modalSelectors.modalOpen(state),
    // modalTitle: modalSelectors.modalTitle(state),
    // modalContent: modalSelectors.modalContent(state),
    // modalForm: modalSelectors.modalForm(state),
    // modalAction: modalSelectors.modalAction(state)
  }
}

const mapDispatchToProps = {
  modalReject: () => modalActionCreators.setModalOpen(false),
  // modalConfirm: (modalAction, modalForm) => modalActionCreators.modalConfirm(modalAction, modalForm),
  // setFormField: (key, value) => modalActionCreators.setModalInputField(key, value)
  // modalConfirm: (action) => ({...action})
}

const options = {

}

const Modal = connect(
  mapStateToProps,
  mapDispatchToProps
  // options
)(ModalDummy)

export default Modal












// const renderModalTitle = (title) => <DialogTitle>{typeof title === 'string' ? title : ''}</DialogTitle>
// // value={selector('roomNickname')}
//
// const chatroomForm = (updater) => {
//   return (
//     <form>
//       <TextField
//          label="Topic*"
//          style={{ margin: 8 }}
//          fullWidth
//          margin="normal"
//          variant="outlined"
//          helperText="channel id: put 'ethereum' or 'ipfs' or 'anything here,
//           it doesnt really matter unless you want to talk to other people
//           then you have to coordinate or pick something common'."
//          onChange={event => updater('channel', event.target.value)}
//        />
//       <TextField
//          label="Nickname (optional)"
//          style={{ margin: 8 }}
//          fullWidth
//          margin="normal"
//          variant="outlined"
//          helperText="see the chat room titled this in the navigation pane"
//          onChange={event => updater('roomNickname', event.target.value)}
//
//        />
//       <TextField
//          label="Write Access (optional)"
//          style={{ margin: 8 }}
//          fullWidth
//          margin="normal"
//          variant="outlined"
//          helperText="specify orbit public keys separated by comma.
//           defaults to * meaning anyone can send messages."
//          onChange={event => updater('write', event.target.value)}
//        />
//     </form>
//   )
// }
//
// const renderForm = (form, updater, selector) => {
//   if (form === null) return null
//   switch (form.type) {
//     case 'chatroom':
//       return chatroomForm(updater, selector)
//   }
// }
//
// const renderModalContent = (content, form, setFormField) => {
//   if (content !== undefined) {
//     return (
//       <DialogContent>
//         <DialogContentText>
//           {!!content.text ? content.text : ''}
//         </DialogContentText>
//         {!!form ? renderForm(form, setFormField) : null}
//       </DialogContent>
//     )
//   }
// }
//
// const renderModalActions = (reject, confirm, action, form) => {
//   return (
//     <DialogActions>
//       <Button onClick={() => reject()} color="primary">
//         Cancel
//       </Button>
//       <Button onClick={() => confirm(action, form)} color="primary" autoFocus>
//         Confirm
//       </Button>
//     </DialogActions>
//   )
// }
