
import React, { Suspense } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import { connect } from 'react-redux'
import {
  navDrawerSelectors,
  navListSelectors
} from '../../state'

import ChatRoom from '../chat/chatRoom'
import Profile from '../profile/profile'

import { unet } from '../../network'

const styles = theme => ({
  root: {
    postion: 'relative',
    display: "grid",
    gridTemplateColumns: `1fr`,
    gridTemplateRows: `auto 1fr`,
    height: '100%',
    width: '100%',
  },
  appBar: {
    gridColumn: 1,
    gridRow: 1,
  },
  content: {
    gridColumn: 1,
    gridRow: 2,
  },
  toolbar: theme.mixins.toolbar,
})


const componentDirs = (componentName) => {
  switch(componentName) {
    case 'chatroom':
      return ChatRoom
      // return '../chat/chatRoom.js'
    case 'profile':
      return Profile
    default:
     console.error('content.js componentName did not match')
  }
}

const renderContent = (navItem) => {
  if(navItem.id === 'profile')
    return null

  const ImportedComponent = componentDirs(navItem.componentName)
  // const ImportedComponent = React.lazy(() => import(componentDirs(navItem.componentName)))

  // const Built = connect(mapStateToProps, mapDispatchToProps)(component)
  return (
    <ImportedComponent {...navItem.props} navItemId={navItem.id} unet={unet} />
  )
}

class Content extends React.Component {

  render() {
    const { classes, selectedNavItemId, navListState } = this.props
    const navItem = navListState[selectedNavItemId]

    return (
      <div
        className={classes.root}>
        <div
          className={classes.appBar}>
          <div className={classes.toolbar}/>
        </div>
        <div
          className={classes.content}>
          {renderContent(navItem)}
        </div>
        {/* <Suspense fallback={<div>Loading...</div>}>
          {renderContent(navItem)}
        </Suspense> */}
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    selectedNavItemId: navDrawerSelectors.getSelectedNavItem(state),
    navListState: navListSelectors.getNavListState(state),
  }
}

const mapDispatchToProps = function(store) {

}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Content))
