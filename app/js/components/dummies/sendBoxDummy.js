
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles"

import TextField from "@material-ui/core/TextField"

const styles = theme => ({

});

class SendBoxDummy extends React.Component {

  handleSend(value){
    this.props.sendMessage(value)
  }

  // handleChange = (event) => {
  //   let draft = event.target.value
  //   this.setState({
  //     chatBox: draft
  //   })
  // }

  handleEnter = (event) => {
    if (event.keyCode == 13 && event.target.value !== "" ) {
      this.handleSend(event.target.value)
      event.target.value = ''
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <TextField
        className={classes.draft}
        id="outlined-full-width"
        style={{ margin: 2, width: '99.5%' }}
        fullWidth
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        /*value={chatBox}
        onChange={(event) => this.handleChange(event)}*/
        onKeyDown={this.handleEnter}
      />
    );
  }
}

SendBoxDummy.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(SendBoxDummy);
