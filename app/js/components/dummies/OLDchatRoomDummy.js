import * as ReactDOM from 'react-dom'
import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import TextField from '@material-ui/core/TextField'

import { MsgDummy } from './msgDummy'

// import ipfsNode from '../../'
// import { ipfsNode } from '../../network'

// import { snetNode } from '../../test'
// let { namedDb } = snet

const styles = theme => ({
  wrapper: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    gridTemplateRows: `1fr auto`,
    height: 'inherit'
  },
  chat: {
    gridColumn: 1,
    gridRow: 1,
    overflow: "auto"
  },
  chatbox: {
    gridColumn: 1,
    gridRow: 2,
  },
  draft: {
    width: '99.5%'
  },
  // toolbar: {
  //   ...theme.mixins.toolbar,
  //   gridColumn: 1,
  //   gridRow: 1
  // }
})

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.db = this.dbInit()
    this.chatHistory =  React.createRef()
  }
  dbInit() {
    const { snetNode } = this.props
    return new Promise((resolve, reject) => {
      snetNode.on('ready', async () => {
        const { roomName, accessControl } = this.props
        const chatConfig = {
          name: roomName,
          type: 'feed',
          options: {
            write: accessControl
          }
        }
        resolve(await snetNode.namedDb(chatConfig))
      })
    })
  }

  state = {
    chatLog: [],
    chatBox: "",
    autoScroll: true
  }

  // chatDb = async (config) => await window.snet.namedDb({
  //   name: this.props.roomName,
  //   type: 'feed',
  //   options: {
  //     write: this.props.accessControl
  //   }
  // })

  handleChange = (event) => {
    let draft = event.target.value
    this.setState({
      chatBox: draft
    })
  }

  handleEnter = (event) => {
    if (event.keyCode == 13 && this.state.chatBox !== "" ) {
      this.handleSend(this.state.chatBox)
    }
  }

  async handleSend(msg) {
    const db = await this.db
    let msgHash = await db.add(msg)
    if (msgHash) {
      this.setState((prevState) => ({
        chatLog: db.iterator({ limit: -1 }).collect(),
        chatBox: ""
      }))
    }
  }

  async updateMsgs() {
    // let db = await this.chatDb()
    const db = await this.db
    const chatHistory = this.chatHistory.current
    const { scrollTop, scrollHeight, offsetHeight } = chatHistory
    const autoScroll = (scrollTop >= scrollHeight - offsetHeight - 2)
    if (!!db) {
      let msgs = db.iterator({ limit: -1 }).collect()
      this.setState({
        chatLog: msgs,
        autoScroll
      })
    }
  }

  async componentDidMount() {
    try {
      const { snetNode } = this.props
      console.log(snetNode)
      snetNode.on('ready', async () => {
        const db = await this.db
        console.log(db)
        db.events.on('replicated', (address) => this.updateMsgs())
        if (db && (this.state.chatLog.length < db.iterator({ limit: -1 }).collect().length)) {
          this.setState({
            chatLog: db.iterator({ limit: -1 }).collect()
          })
        }
      })
    }
    catch(e) {
      console.error(e)
    }
  }

  scrollToBottom = () => {
    // const { messageList } = this.refs
    // const scrollHeight = messageList.scrollHeight
    // const height = messageList.clientHeight
    // const maxScrollTop = scrollHeight - height
    // ReactDOM.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }

  async componentWillUnmount() {

  }

  // componentWillUpdate() {
  //   const node = ReactDOM.findDOMNode(this)
  //   this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.chatLog !== this.state.chatLog && this.state.autoScroll) {
      const chatHistory = this.chatHistory.current
      chatHistory.scrollTop = chatHistory.scrollHeight
    }
  }

  render() {
    const { classes, dbConfig } = this.props
    const { chatLog, chatBox } = this.state

    return (
      <div className={classes.wrapper}>
        {/* <div className={classes.toolbar}></div> */}
        <div className={classes.chat} ref={this.chatHistory}>
          {chatLog.map((obj, index) =>
            <MsgDummy
              key={index}
              msgValue={obj.payload.value}
              msgSender={obj.key.slice(obj.key.length-9, obj.key.length-1)} />)}
        </div>
        <div className={classes.chatbox}>
          <TextField
            className={classes.draft}
            id="outlined-full-width"
            style={{ margin: 2 }}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={chatBox}
            onChange={(event) => this.handleChange(event)}
            onKeyDown={this.handleEnter}
          />
        </div>
      </div>
    )
  }
}

// const mapStateToProps = function(store) {
//   return {
//   }
// }
//
// const mapDispatchToProps = function(store) {
//   return {
//   }
// }

Chat.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Chat)
