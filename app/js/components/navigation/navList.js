
import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Add from '@material-ui/icons/Add'
import Menu from '@material-ui/core/Menu'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'

import { connect } from 'react-redux'
import {
  navListSelectors,
  navListActionCreators,
  navDrawerSelectors,
  navDrawerActionCreators,
} from '../../state'
import { modalActionCreators } from '../../state'

const styles = theme => ({
  list: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
})

class NavList extends React.Component {

  state = {
    optionsAnchor: null,
    optionsNavItem: null,
  }

  handleOptionsOpen = (event, navItem) => {
    this.setState({
      optionsAnchor: event.currentTarget,
      optionsNavItem: navItem,
    })
  }

  handleOptionsClose = (action = null, param = null) => {
    if (!!action) {
      !!param ? action(param) : action()
    }
    this.setState({
      optionsAnchor: null,
      optionsNavItem: null,
    })
  }

  isSelected = (list, itemId) => {
    const { heirOrder, selectedNavItem } = this.props
    const itemHeirs = heirOrder(list, itemId)
    const index = itemHeirs.length - 1
    return itemHeirs[index] === heirOrder(list, selectedNavItem)[index]
  }

  handleSelect = (navItem) => {
    this.props.setSelectedNavItem(navItem.id)
  }

  handleExpand = (navItem) => {
    this.props.toggleExpand(navItem)
  }

  handleCreate = (navItem) => {
    this.props.createable(navItem)
  }

  handleFunctionPick = (navItem) => {
    switch (navItem.type) {
      case 'link':
        return this.handleSelect(navItem)
      case 'expandable':
        return this.handleExpand(navItem)
      case 'createable':
        return this.handleCreate(navItem.action)
    }
  }

  renderIconButtons = (navItem) => {
    const { componentName } = navItem
    switch (componentName) {
      case 'chatroom':
        return (
          <ListItemSecondaryAction>
            <IconButton
              onClick={event => this.handleOptionsOpen(event, navItem)}
              aria-label="Options">
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )
      default:
        return null
    }
  }

  mapNavListStateToList = (list,  order, expanded = true, i = 1) => {
    const genesis = i === 1
    const renderedItems = order.map((navItemId, index) => {
      const navItem = list[navItemId]
      const text = !!navItem.dummyKey && navItem.dummyKey === 'chatroom'
          ? `#${navItem.title}`
          : navItem.title
      const expandable = !!navItem.children
      return (
        <div key={index}>
          <ListItem
            button
            id={navItem.name}
            selected={this.isSelected(list, navItemId) && !navItem.open}
            onClick={() => this.handleFunctionPick(navItem)}
            >
            {navItem.type === 'createable' ? <Add /> : null}
            <ListItemText primary={text} />
            {
              expandable
              ? (navItem.open ? <ExpandLess /> : <ExpandMore />)
              : null
            }
            {this.renderIconButtons(navItem)}
          </ListItem>
          {
            expandable && navItem.open
            ? this.mapNavListStateToList(
              list,
              this.props.childOrder(list, navItemId),
              navItem.open, i + 1
            )
            : null
          }
        </div>
      )
    })
    return (
      <Collapse keys={i} in={expanded} timeout="auto" unmountOnExit>
        <List component={'nav'} disablePadding={genesis}>
          {renderedItems}
        </List>
      </Collapse>
    )
  }

  renderMenuOptions = (navItem) => {
    if (navItem === null) {
      return null
    }
    const { reqRemoveNavItem } = this.props
    const { id, componentName } = navItem
    switch (componentName) {
      case 'chatroom':
        return (
          <MenuList>
            <MenuItem
              onClick={() => this.handleOptionsClose(reqRemoveNavItem, navItem)}>
                leave chat
            </MenuItem>
          </MenuList>
        )
      case null:
      default:
        return null
    }
  }

  render() {
    const { classes, navListState, childOrder } = this.props
    const { optionsAnchor, optionsNavItem } = this.state
    return (
      <div className={classes.list}>
        {this.mapNavListStateToList(navListState, childOrder(navListState, 'root'))}
        <Menu
          anchorEl={optionsAnchor}
          open={!!optionsAnchor && !!optionsNavItem}
          onClose={() => this.handleOptionsClose()}
          disableAutoFocusItem>
          {this.renderMenuOptions(optionsNavItem)}
        </Menu>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    selectedNavItem: navDrawerSelectors.getSelectedNavItem(state),
    navListState: navListSelectors.getNavListState(state),
    childOrder: navListSelectors.getChildOrder,
    heirOrder: navListSelectors.getHeirOrder,
  }
}

const mapDispatchToProps = {
    setSelectedNavItem: navDrawerActionCreators.setSelectedNavItem,
    toggleExpand: navListActionCreators.toggleExpand,
    selectLink: navListActionCreators.selectLink,
    createable: (action) => ({...action}),
    reqRemoveNavItem: navListActionCreators.reqRemoveNavItem,
}

NavList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NavList))
