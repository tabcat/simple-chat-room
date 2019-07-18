
import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Avatar from "@material-ui/core/Avatar"
import Grid from "@material-ui/core/Grid"

const styles = theme => ({
  back: {
    width: "100%",
    height: "100%",
    "background-image":
      "url(https://www.html.am/images/backgrounds/background-image-2.gif)",
    "background-repeat": "repeat"
  },
  root: {
    margin: "auto",
    padding: "10px",
    // width: "66%",
    [theme.breakpoints.down("sm")]: {
      width: "93%"
    },
    height: "100%",
    overflow: 'auto',
  },
  title: {
    marginTop: 50,
    marginBottom: 50,
    paddingTop: 100,
    paddingBottom: 100,
    [theme.breakpoints.down("sm")]: {
      marginTop: 50,
      marginBottom: 50,
      paddingTop: 80,
      paddingBottom: 80
    }
  },
  titleText: {
    "font-size": "400%",
    [theme.breakpoints.down("sm")]: {}
  },
  login: {
    marginBottom: 30,
    [theme.breakpoints.down("sm")]: {
      marginBottom: 15
    }
  },
  loginText: {
    "font-size": "250%",
    [theme.breakpoints.down("sm")]: {}
  },
  center: {
    margin: "auto",
    marginBottom: 15,
    padding: "10px",
    [theme.breakpoints.down("sm")]: {
      width: "94%"
    }
  },
  flex: {
    display: "flex"
  },
  textOverflow: {
    overflow: "hidden",
    "white-space": "nowrap"
  },
  avatar: {
    margin: 10
  },
  user: {
    "text-align": "center",
    marginTop: 15,
    marginLeft: 15,
    overflow: "hidden",
    "white-space": "nowrap",
    "text-overflow": "ellipsis"
  },
  userOptionsButton: {
     margin: theme.spacing.unit,
  },
  options: {
    width: "40%",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  optionPaper: {
    margin: "auto",
    marginBottom: 15,
    padding: "10px",
    [theme.breakpoints.down("sm")]: {
      width: "94%"
    },
    background: "green"
  },
  optionText: {
    "text-align": "center",
    color: "white"
  },
  flexSpacer: {
    'flex-grow': 1,
  },
})

const mapUsers = (props) => {
  const { classes, localUsers, reqLoginUser } = props

  if (localUsers === null || Object.keys(localUsers).length  === 0) {
    const statusMsg = localUsers === null
      ? 'loading existing users'
      : 'no local users found'
    return (
      <Paper className={classes.center} elevation={1}>
        <div >
          <Typography
            className={classes.user}
            variant="h5"
            component="h3">
            {statusMsg}
          </Typography>
        </div>
      </Paper>
    )
  }

  return Object.keys(localUsers).map((userKey, index) => {
    const user = localUsers[userKey]
    return (
      <Paper className={classes.center} elevation={1} key={index}>
        <div className={classes.flex} onClick={() => reqLoginUser(user)}>
          <Avatar className={classes.avatar}>{user.name[0]}</Avatar>
          <div>
            <Typography
              className={classes.user}
              variant="h5"
              component="h3">
              {user.name}
            </Typography>
          </div>
        </div>
      </Paper>
    )
  })
}

class LoginDummy extends React.Component {

  promptCreateUser = () => {
    this.props.setModalType('createUser')
  }

  componentDidMount() {
    this.props.reqLoadLocalUsers()
  }

  render() {
    const { classes, localUsers, reqLoginUser } = this.props

    return (
      <div className={classes.back}>
        <div className={classes.root}>
          <div className={classes.title}>
            <Typography className={classes.titleText} align="center">
              Unnamed
            </Typography>
            <Typography align="center">v0.0.1</Typography>
          </div>
          <div className={classes.login}>
            <Typography className={classes.loginText} align="center">
              Login
            </Typography>
          </div>
          <Grid container justify="center" alignItems="center">
            <div className={classes.options}>
              {mapUsers(this.props)}
              <Paper className={classes.optionPaper} elevation={1}>
                <div
                  onClick={() => this.promptCreateUser()}>
                  <Typography
                    className={classes.optionText}
                    variant="h5"
                    component="h3">
                    new user
                  </Typography>
                </div>
              </Paper>
            </div>
          </Grid>
        </div>
      </div>
    )
  }
}

LoginDummy.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LoginDummy)
