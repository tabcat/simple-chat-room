
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles"
import withMobileDialog from '@material-ui/core/withMobileDialog'
import Dialog from '@material-ui/core/Dialog'

import ModalCreateChatroom from '../modal/modalCreateChatroom'
import ModalCreateUser from '../modal/modalCreateUser'

const styles = theme => ({

})

const modalSwitch = (modalKey) => {
  switch (modalKey) {
    case 'createChatroom':
      return <ModalCreateChatroom/>
    case 'createUser':
      return <ModalCreateUser/>
    default:
      return 'empty'
  }
}

class ModalDummy extends React.Component {

  render() {
    const {
      fullScreen,
      modalOpen,
      modalReject,
      modalType,
    } = this.props

    return (
      <Dialog
        fullScreen={fullScreen}
        open={modalOpen}
        onClose={() => modalReject()}
      >
        {modalSwitch(modalType)}
      </Dialog>
    )
  }
}

ModalDummy.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
}

export default withMobileDialog()(withStyles(styles)(ModalDummy))
