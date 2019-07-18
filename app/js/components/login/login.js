
import { connect } from 'react-redux'
import {
  usersSelectors,
  usersActionCreators,
  modalActionCreators,
} from '../../state'

import LoginDummy from '../dummies/loginDummy'

const mapStateToProps = state => {
  return {
    localUsers: usersSelectors.getLocalUsers(state),
  }
}

const mapDispatchToProps = {
  reqLoginUser: usersActionCreators.reqLoginUser,
  // createUser: usersActionCreators.createUser,
  reqLoadLocalUsers: usersActionCreators.reqLoadLocalUsers,
  setModalType: modalActionCreators.setModalType,
}

const options = {

}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  // options,
)(LoginDummy)

export default LoginContainer
