import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles"

import MsgDummy from './msgDummy'

const styles = theme => ({
  chatFeed: {
    display: "block",
    overflow: "auto",
  }
})

class ChatFeedDummy extends React.Component {
  constructor(){
    super()
    this.chatHistory = React.createRef()
  }

  handleScroll = (event) => {
    // console.log(event)
    // maybe debounce some of these events with an rxjs observable for performance
    const chatHistory = this.chatHistory
    const {
      scrollTop,
      scrollHeight,
      offsetHeight
    } = event.target
    const autoScroll = (scrollTop >= scrollHeight - offsetHeight - 2)
    this.handleSetScroll(autoScroll, (autoScroll ? null : scrollTop))
  }

  handleSetScroll = (autoScroll, scrollTop) => {
    this.props.setScroll(autoScroll, scrollTop)
  }

  updateScrollTop = () => {
    const { autoScroll, scrollTop } = this.props
    const chatHistory = this.chatHistory.current
    if (autoScroll) {
      chatHistory.scrollTop = chatHistory.scrollHeight
    } else {
      chatHistory.scrollTop = scrollTop
    }
  }

  componentDidMount() {
    this.chatHistory.current.addEventListener('scroll', this.handleScroll)
    this.updateScrollTop()
  }

  componentWillUnmount() {
    this.chatHistory.current.removeEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate(prevProps, prevState) {
    const props = this.props
    if (prevProps.chatFeed !== props.chatFeed) {
      this.updateScrollTop()
    }
  }

  render() {
    const { classes, chatFeed } = this.props

    return (
      <div className={classes.chatFeed} ref={this.chatHistory}>
        {chatFeed.map((entry, index) =>
          <MsgDummy
            key={index}
            text={entry.payload.msg}
            timestamp={entry.payload.time}
            sender={
              !!entry.payload.profileName
              ? entry.payload.profileName
              : entry.key.slice(entry.key.length-5, entry.key.length)
            }
            profileId={
              !!entry.payload.profileName
              ? `#${entry.key.slice(entry.key.length-5, entry.key.length)}`
              : null
            }/>
          )}
      </div>
    )
  }
}

ChatFeedDummy.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(ChatFeedDummy)
