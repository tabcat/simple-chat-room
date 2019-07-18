
import React from "react"
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import LinearProgress from '@material-ui/core/LinearProgress'

import ChatFeedDummy from '../dummies/chatFeedDummy'
import SendBoxDummy from '../dummies/sendBoxDummy'

import { connect } from 'react-redux'
import {
  chatFeedsSelectors,
  chatFeedsActionCreators,
  chatRoomsSelectors,
  chatRoomsActionTypes,
  chatRoomsActionCreators,
  orbitDbsActionCreators,
  orbitTmsSelectors,
  usersSelectors,
} from '../../state'

const styles = theme => ({
  wrapper: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    gridTemplateRows: `1fr auto`,
    height: `calc(100% - 64px)`,//the 64px is referring to one of toolbars minHeight
  },
  history: {
    gridColumn: 1,
    gridRow: 1,
  },
  sendBox: {
    gridColumn: 1,
    gridRow: 2,
  },
  progress: {
    margin: 'auto',
  },
})

const PeerInfo = (props) => {
  const { peers } = props
  return (
    `topic peers: ${peers.length}`
  )
}

class ChatRoom extends React.Component {

  handleSendMessage = async (msg) => {
    try {
      const { unet, orbitAddr, userName } = this.props
      const db =
        unet.orbits[unet.userNameWithPrefix(userName)].stores[orbitAddr]
      await db.add({
        msg,
        time: `${window.Date.now()}`,
        profileName: userName,
      })
    }
    catch (e) {
      console.error(e)
    }
  }

  handleDeleteMessage = async (hash) => {
    try {
      const { unet, orbitAddr, userName } = this.props
      const db = unet.orbits[userName].stores[orbitAddr]
      await db.remove(hash)
    }
    catch (e) {
      console.error(e)
    }
  }

  boundAutoScroll = (autoScroll, scrollTop) => {
    this.props.setScroll(this.props.orbitAddr, autoScroll, scrollTop)
  }

  async componentDidMount() {
    try {
      const {
        orbitAddr,
        getChatRoom,
        initializing,
      } = this.props
      if (!!orbitAddr && !initializing) {

      } else {

      }
    }
    catch(e) {
      console.error(e)
    }
  }

  async componentDidUpdate(prevProps) {
    const props = this.props
    const roomChange = props.navItemId !== prevProps.navItemId
    const initialized = (p) => !!p.orbitAddr && !p.initializing
    const initializing = (p) => !!p.initializing
    if (roomChange) {
      // called when the room has changed and last room was initialized
      if (initialized(prevProps)) {}

      // called when the room has changed and new room was initialized
      if (initialized(props)) {

      } else if (!initializing(props)) {

      }
    } else {
      // called if room is initialized while on it
      if (initialized(props) && !initialized(prevProps)) {

      }
    }
  }

  render() {
    const {
      classes,
      name,
      orbitAddr,
      getChatRoom,
      getChatFeed,
      getAutoScroll,
      getScrollTop,
      getTopicMonitor,
      setScroll,
      initializing,
    } = this.props

    const roomReady = !!orbitAddr && !initializing

    const gettingReady = <LinearProgress />

    return (
      <div
        className={classes.wrapper}>
        {roomReady
          ? <>
              <ChatFeedDummy
                className={classes.history}
                chatFeed={getChatFeed(orbitAddr)}
                autoScroll={getAutoScroll(orbitAddr)}
                scrollTop={getScrollTop(orbitAddr)}
                setScroll={this.boundAutoScroll}/>
              <PeerInfo
                peers={getTopicMonitor(orbitAddr)}/>
              <SendBoxDummy
                classname={classes.sendBox}
                sendMessage={this.handleSendMessage}/>
            </>
          : gettingReady}
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    getChatRoom: chatRoomsSelectors.getChatRoom(state),
    getChatFeed: chatFeedsSelectors.getChatFeed(state),
    getAutoScroll: chatRoomsSelectors.getAutoScroll(state),
    getScrollTop: chatRoomsSelectors.getScrollTop(state),
    getTopicMonitor: orbitTmsSelectors.getTopicMonitor(state),
    userName: usersSelectors.getCurrentUserName(state),
  }
}

const mapDispatchToProps = {
    // setNewChatRoom: chatRoomsActionCreators.setNewChatRoom,
    openDbOrbit: orbitDbsActionCreators.openDbOrbit,
    setScroll: chatRoomsActionCreators.setScroll,
    // updateChatFeed:  chatFeedsActionCreators.updateChatFeed,
    // addMessageToChatFeed: ,
}

ChatRoom.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ChatRoom))
