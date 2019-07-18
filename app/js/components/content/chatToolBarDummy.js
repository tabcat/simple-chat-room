
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  root: {
    display: "flex",
  }
});

class ChatToolBarDummy extends React.Component {

  // state = {
  //   anchorEl: null,
  //   mobileMoreAnchorEl: null,
  // }
  //
  // handleProfileMenuOpen = event => {
  //   this.setState({ anchorEl: event.currentTarget })
  // }
  //
  // handleMenuClose = () => {
  //   this.setState({ anchorEl: null })
  //   this.handleMobileMenuClose()
  // }
  //
  // handleMobileMenuOpen = event => {
  //   this.setState({ mobileMoreAnchorEl: event.currentTarget })
  // }
  //
  // handleMobileMenuClose = () => {
  //   this.setState({ mobileMoreAnchorEl: null })
  // }

  render() {
    const { classes } = this.props;


    return (
      <>
        <IconButton color="inherit">
          <Badge badgeContent={17} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </>
    );
  }
}

ChatToolBarDummy.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles)(ChatToolBarDummy);
// const { anchorEl, mobileMoreAnchorEl } = this.state
// const isMenuOpen = Boolean(anchorEl)
// const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
//
// const renderMenu = (
//   <Menu
//     anchorEl={anchorEl}
//     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//     transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//     open={isMenuOpen}
//     onClose={this.handleMenuClose}
//   >
//     <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
//     <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
//   </Menu>
// )
//
// const renderMobileMenu = (
//   <Menu
//     anchorEl={mobileMoreAnchorEl}
//     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//     transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//     open={isMobileMenuOpen}
//     onClose={this.handleMenuClose}
//   >
//     <MenuItem onClick={this.handleMobileMenuClose}>
//       <IconButton color="inherit">
//         <Badge badgeContent={4} color="secondary">
//           <MailIcon />
//         </Badge>
//       </IconButton>
//       <p>Messages</p>
//     </MenuItem>
//     <MenuItem onClick={this.handleMobileMenuClose}>
//       <IconButton color="inherit">
//         <Badge badgeContent={11} color="secondary">
//           <NotificationsIcon />
//         </Badge>
//       </IconButton>
//       <p>Notifications</p>
//     </MenuItem>
//     <MenuItem onClick={this.handleProfileMenuOpen}>
//       <IconButton color="inherit">
//         <AccountCircle />
//       </IconButton>
//       <p>Profile</p>
//     </MenuItem>
//   </Menu>
// )
//
// <div className={classes.sectionDesktop}>
//   <IconButton color="inherit">
//     <Badge badgeContent={4} color="secondary">
//       <MailIcon />
//     </Badge>
//   </IconButton>
//   <IconButton color="inherit">
//     <Badge badgeContent={17} color="secondary">
//       <NotificationsIcon />
//     </Badge>
//   </IconButton>
//   <IconButton
//     aria-owns={isMenuOpen ? 'material-appbar' : undefined}
//     aria-haspopup="true"
//     onClick={this.handleProfileMenuOpen}
//     color="inherit"
//   >
//     <AccountCircle />
//   </IconButton>
// </div>
// <div className={classes.sectionMobile}>
//   <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
//     <MoreIcon />
//   </IconButton>
// </div>
// <div className={classes.search}>
//   <div className={classes.searchIcon}>
//     <SearchIcon />
//   </div>
//   <InputBase
//     placeholder="Search…"
//     classes={{
//       root: classes.inputRoot,
//       input: classes.inputInput,
//     }}
//   />
// </div>
// {renderMenu}
// {renderMobileMenu}
