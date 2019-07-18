
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles"
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const styles = theme => ({
  root: {
    display: "flex",
  },
  listItem: {
    background: 'white',
  },
  listItemText: {
    'font-size': '150%',
  },
})

// const mapUsers = (props) => {
//   const { classes, localUsers, reqLoginUser } = props
//
//   if (localUsers === null || Object.keys(localUsers).length  === 0) {
//     const statusMsg = localUsers === null
//       ? 'loading existing users'
//       : 'no local users found'
//     return (
//       <Paper className={classes.center} elevation={1}>
//         <div >
//           <Typography
//             className={classes.user}
//             variant="h5"
//             component="h3">
//             {statusMsg}
//           </Typography>
//         </div>
//       </Paper>
//     )
//   }
//
//   return Object.keys(localUsers).map((userKey, index) => {
//     const user = localUsers[userKey]
//     return (
//       <Paper className={classes.center} elevation={1} key={index}>
//         <div className={classes.flex} onClick={() => reqLoginUser(user)}>
//           <Avatar className={classes.avatar}>{user.name[0]}</Avatar>
//           <div>
//             <Typography
//               className={classes.user}
//               variant="h5"
//               component="h3">
//               {user.name}
//             </Typography>
//           </div>
//           <div className={classes.flexGrow}/>
//           <IconButton
//             className={classes.userOptionsButton}
//             aria-label="Delete"
//             disabled color="primary">
//             <MoreVertIcon />
//           </IconButton>
//         </div>
//       </Paper>
//     )
//   })
// }
//
// <List dense={dense}>
//   {generate(
//     <ListItem>
//       <ListItemAvatar>
//         <Avatar>
//           <FolderIcon />
//         </Avatar>
//       </ListItemAvatar>
//       <ListItemText>
//         {user.name}
//       </ListItemText>
//       <ListItemSecondaryAction>
//         <IconButton aria-label="Options">
//           <MoreVertIcon />
//         </IconButton>
//       </ListItemSecondaryAction>
//     </ListItem>
//   )}
// </List>

const noLocalUsers = (props) => (
  <ListItem key={1}>
    <ListItemText
      className={props.classes.listItemText}
      alignItems='center'>
      no users found
    </ListItemText>
  </ListItem>
)

const renderUserList = (props) => {
  const { classes, localUsers, reqLoginUser } = props
  return localUsers === null || Object.keys(localUsers).length  === 0
  ? noLocalUsers(props)
  : Object.keys(localUsers).map((userKey, index) => {
    const user = localUsers[userKey]
    return (
      <ListItem key={index} onClick={() => reqLoginUser(userKey)}>
        <ListItemAvatar>
          <Avatar className={classes.avatar}>{user.name[0]}</Avatar>
        </ListItemAvatar>
        <ListItemText>
          {user.name}
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton aria-label="Options" onClick={console.log}>
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  })
}

class UserListDummy extends React.Component {

  render() {
    return (
      <>
        <List>
          {renderUserList(this.props)}
        </List>
      </>
    )
  }
}

UserListDummy.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(UserListDummy)
