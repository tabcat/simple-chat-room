import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  message: {
    // display: "grid",
    // gridTemplateColumns: `auto auto 1fr`,
    // gridTemplateRows: `auto auto`,
    display: 'block',
    width: '95.5%%',
    // paddingLeft: '10px',
    // paddingRight: '10px',
    // paddingTop: '15px',
    // paddingBottom: '15px',
    padding: '10px',
    paddingRight: '2px',
    flexWrap: 'wrap',
    backgroundColor: '#fcfcfc',
    // backgroundColor: '#ccffcc',
  },
  meta: {
    display: 'flex'
  },
  sender: {
    // gridColumn: 1,
    // gridRow: 1,
    flexWrap: 'wrap',
    padding: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  timestamp: {
    // gridColumn: 2,
    // gridRow: 1,
    flexWrap: 'wrap',
    padding: '5px',
    paddingTop: '9px',
    fontSize: '12px',
  },
  text: {
    // gridColumnStart: 1,
    // gridColumnEnd: 3,
    // gridRow: 2,
    flexWrap: 'wrap',
    padding: '5px',
  },
  spacer: {
    // paddingTop: '5px',
    margin: '0'
  },
  profileId: {
    padding: '5px',
    paddingRight: '10px',
    paddingLeft: '0px',
    paddingTop: '9px',
    fontSize: '12px',
    color: 'grey',
  },
})

const timeRender = (timestamp) => {
  const stamp = new window.Date(parseInt(timestamp))
  const reference = new window.Date(window.Date.now())
  const stampDate = stamp.getDate()
  const date = stampDate === reference.getDate()
    ? 'Today'
    : `${stamp.toLocaleDateString()}`
    return `${stamp.toLocaleTimeString()}  ${date}`
}

class MsgDummy extends React.Component {

  render() {
    const { classes, text, sender, timestamp, profileId } = this.props;

    return (
      <>
        <div
          className={classes.message}>
          <div
            className={classes.meta}>
            <Typography
              className={classes.sender}
              // variant='h6'
              children={sender}/>
            <Typography
              className={classes.profileId}
              // variant='h6'
              children={profileId}/>
            <Typography
              className={classes.timestamp}
              color='textSecondary'
              // headlineMapping='body2'
              children={timeRender(timestamp)}/>
          </div>
          <div
            className={classes.meta}>
            <Typography
              className={classes.text}
              // headlineMapping='h6'
              children={text}/>
          </div>
        </div>
        <hr className={classes.spacer}/>
      </>
    );
  }
}

MsgDummy.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MsgDummy)
