
import React, { Suspense, lazy } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import CircularProgress from '@material-ui/core/CircularProgress'

import { connect } from 'react-redux'
import {
  usersSelectors,
} from '../state'

import Login from './login/login'

import Appbar from './content/appbar'
import NavDrawer from './navigation/navDrawer'
import Content from './content/content'
import Modal from './modal/modal'

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%"
  },
  loading: {
    margin: 'auto',
  }
})

const renderApp = (props) => {
  const { classes, currentUser } = props
  if (typeof currentUser === 'object') {
    return (
      <>
        <Appbar/>
        <NavDrawer/>
        <Content/>
      </>
    )
  } else {
    if (currentUser === 0) {
      return <Login/>
    }
    if (currentUser === 1) {
      return <CircularProgress className={classes.loading} size='100'/>
    }
  }
}

class Unnamed extends React.Component {

  render() {
    const { classes, currentUser } = this.props

    return (
      <div className={classes.root}>
        {renderApp(this.props)}
        <Modal/>
      </div>
    )
  }
}

Unnamed.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    currentUser: usersSelectors.getCurrentUser(state),
  }
}

const mapDispatchToProps = {

}

const options = {

}

export default
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withStyles(styles, { withTheme: true })(Unnamed))
