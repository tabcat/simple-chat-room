
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import MenuIcon from "@material-ui/icons/Menu"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"

const navDrawerWidth = 240

const styles = theme => ({
  appbar: {
    position: "absolute",
    marginLeft: navDrawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${navDrawerWidth}px)`
    },
    background: '#83a5ea',
  },
  toolbar: theme.mixins.toolbar,
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
})

class AppbarDummy extends React.Component {

  handleDrawerToggle = () => {
    const { drawerOpenness, drawerToggle } = this.props
    this.props.drawerToggle(!drawerOpenness)
  }

  render() {
    const { classes, navItem, navItemParent } = this.props
    const title = !!navItemParent && navItemParent.id !== 'root'
      ? `${navItemParent.title} / ${navItem.title}`
      : navItem.title

    return (
      <>
        <AppBar className={classes.appbar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography
            variant="title"
            color="inherit"
            children={title}
            noWrap
            />
          </Toolbar>
        </AppBar>
      </>
    )
  }
}

AppbarDummy.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(AppbarDummy)
