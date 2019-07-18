
import { connect } from 'react-redux'
import {
  navDrawerSelectors,
  navDrawerActionCreators,
  navListSelectors
} from '../../state'

import AppbarDummy from '../dummies/appbarDummy'

const mapStateToProps = state => {
  const navList = navListSelectors.getNavListState(state)
  const navItem = navList[navDrawerSelectors.getSelectedNavItem(state)]
  const navItemParent = !!navItem.parentId
    ? navList[navItem.parentId]
    : null
  return {
    navItem,
    navItemParent,
    navList,
    drawerOpenness: navDrawerSelectors.getNavDrawerOpenness(state),
  }
}

const mapDispatchToProps = {
  drawerToggle: navDrawerActionCreators.setNavDrawerOpenness,
}

const options = {

}

const Appbar = connect(
  mapStateToProps,
  mapDispatchToProps,
  // options
)(AppbarDummy)

export default Appbar
