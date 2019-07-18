
import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import { connect } from 'react-redux'
import {
  modalSelectors,
  modalActionCreators,
  navListActionCreators,
} from '../../state'

const styles = theme => ({
})

const chatRoomNavItemConfig = (modalState) => {
  const write = !!modalState && !!modalState.write
    ? modalState.write.split(',')
    : ['*']
  return {
    title: modalState.channel,
    name: modalState.channel,
    type: 'link',
    componentName: 'chatroom',
    props: {
      name: modalState.channel,
      orbitType: 'feed',
      orbitOptions: {
        accessController: { type:'ipfs', write },
      },
      orbitAddr: null,
      initializing: false,
    }
  }
}

class ModalCreateChatroom extends React.Component {

  updateField = (field, value) => {
    const { modalType, setModalTypeFields } = this.props
    const changes = { [field]: value }
    setModalTypeFields(modalType, changes)
  }

  confirm = () => {
    const { modalState, modalConfirm } = this.props
    const binds = { parentId: 'chat' }
    const navItemConfig = chatRoomNavItemConfig(modalState)
    const modalAction =
      navListActionCreators.addNavItem(binds, navItemConfig)
    modalConfirm(modalAction)
  }

  render() {
    const { classes, modalReject } = this.props

    const form =
    <form>
      <TextField
         label="Topic*"
         style={{ margin: 8 }}
         fullWidth
         margin="normal"
         variant="outlined"
         helperText="channel id: put 'ethereum' or 'ipfs' or 'anything here,
          it doesnt really matter unless you want to talk to other people
          then you have to coordinate or pick something common'."
         onChange={event => this.updateField('channel', event.target.value)}
       />
      <TextField
         label="Write Access (optional)"
         style={{ margin: 8 }}
         fullWidth
         margin="normal"
         variant="outlined"
         helperText="specify orbit public keys separated by comma.
          defaults to * meaning anyone can send messages."
         onChange={event => this.updateField('write', event.target.value)}
       />
    </form>

    return (
      <>
        <DialogTitle>Create new chatroom?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill out required fields to add a new chatroom
            to your navigation pane.
          </DialogContentText>
          {form}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => modalReject()} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => this.confirm()}
            color="primary"
            autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  const modalType = modalSelectors.modalType(state)
  return {
    modalType,
    modalOpen: modalSelectors.modalOpen(state),
    modalState: modalSelectors.modalTypeState(state, modalType),
  }
}

const mapDispatchToProps =  {
  modalReject: () => modalActionCreators.setModalOpen(false),
  modalConfirm: modalActionCreators.modalConfirm,
  setModalTypeFields: modalActionCreators.setModalTypeFields,
}

ModalCreateChatroom.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(ModalCreateChatroom))
