
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
  usersActionCreators,
} from '../../state'

const styles = theme => ({
})

class ModalCreateChatroom extends React.Component {

  updateField = (field, value) => {
    const { modalType, setModalTypeFields } = this.props
    const changes = { [field]: value }
    setModalTypeFields(modalType, changes)
  }

  confirm = () => {
    const { modalState, modalConfirm } = this.props
    const modalAction = usersActionCreators.createUser(modalState)
    modalConfirm(modalAction)
  }

  handleEnter = (event) => {
    if (event.keyCode == 13 && event.target.value !== "" ) {
      this.confirm()
      event.preventDefault()
    }
  }

  render() {
    const { classes, modalReject } = this.props

    const form =
    <form>
      <TextField
         label="Name*"
         style={{ margin: 8 }}
         fullWidth
         margin="normal"
         variant="outlined"
         helperText="name for this user"
         onChange={event => this.updateField('userName', event.target.value)}
         onKeyDown={this.handleEnter}
       />
    </form>

    return (
      <>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill out required fields then confirm.
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
