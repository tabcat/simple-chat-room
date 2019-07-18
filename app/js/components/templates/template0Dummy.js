
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  root: {
    display: "flex",
  }
});

class Template0Dummy extends React.Component {

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
      </div>
    );
  }
}

Template0Dummy.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Template0Dummy);
