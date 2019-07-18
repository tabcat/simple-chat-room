import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import Drawer from "@material-ui/core/Drawer"
import Typography from "@material-ui/core/Typography"
import Hidden from "@material-ui/core/Hidden"
import Divider from "@material-ui/core/Divider"

import { connect } from 'react-redux'
import {
  navDrawerSelectors,
  navDrawerActionCreators,
  navListSelectors
} from '../../state'

import NavList from './navList'

const navDrawerWidth = 240

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: navDrawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  footer: {
    position: "absolute",
    bottom: 10
  }
})

class NavDrawer extends React.Component {

  handleDrawerToggle = () => {
    const { navDrawerOpenness, setNavDrawerOpenness } = this.props
    setNavDrawerOpenness(!navDrawerOpenness)
  }

  render() {
    const { classes, theme, navDrawerOpenness, getNavDrawerOpenness, setNavDrawerOpenness } = this.props

    const drawer = (
      <div>
          <div className={classes.toolbar} onClick={() => console.log(this.props.state)} >
            <Typography align="center" variant="headline" >
              {`Unnamed`}
            </Typography>
            <Typography align="center" variant="caption">
              v0.1.0
            </Typography>
          </div>
        <Divider />
        <div className={classes.list}>
          <NavList />
        </div>
        {/* <div className={classes.footer}>
          test
        </div> */}
      </div>
    )

    return (
      <>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={navDrawerOpenness}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    selectedNavItem: navDrawerSelectors.getSelectedNavItem(state),
    navDrawerOpenness: navDrawerSelectors.getNavDrawerOpenness(state),
    navListState: navListSelectors.getNavListState(state),
    state: state,
  }
}

const mapDispatchToProps = {
    setNavDrawerOpenness: navDrawerActionCreators.setNavDrawerOpenness
}

NavDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(NavDrawer))
