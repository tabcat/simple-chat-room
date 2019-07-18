
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles"
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Done from '@material-ui/icons/Done'
import HourglassEmpty from '@material-ui/icons/HourglassEmpty'

const styles = theme => ({
  root: {
    // display: "flex",
    overflow: "auto",
  },
  flex: {
    display: "flex",
  },
  block: {
    display: "block",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 250,
  },
});

class ProfileDummy extends React.Component {

  state = {}

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <TextField
          label="profile name"
          defaultValue={'profile.name'}
          className={classes.textField}
          helperText="what other users see. does not change name at login."
          margin="normal"
          InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {
                    !!this.state.name || this.state.name === 'profile.name'
                    ? <HourglassEmpty/>
                    : <Done/>
                  }
                </InputAdornment>
              ),
            }}/>
      </div>
    );
  }
}

ProfileDummy.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(ProfileDummy);
