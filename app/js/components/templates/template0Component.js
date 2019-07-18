// class component template
import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import { connect } from 'react-redux'
import store from '../redux'

const styles = theme => ({
  root: {
    display: "flex",
  }
})

class Template0 extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return {
  }
}

const mapDispatchToProps = function(store) {
  return {
  }
}

Template0.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Template0))
