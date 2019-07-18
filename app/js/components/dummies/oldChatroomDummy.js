import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

import MsgDummy from '../dummies/msgDummy';

const styles = theme => ({
  wrapper: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    gridTemplateRows: `auto 1fr auto`,
    height: '100%'
  },
  chat: {
    gridColumn: 1,
    gridRow: 2,
    overflow: "auto"
  },
  chatbox: {
    gridColumn: 1,
    gridRow: 3,
  },
  draft: {
    width: '99.5%'
  },
  toolbar: {
    ...theme.mixins.toolbar,
    gridColumn: 1,
    gridRow: 1
  }
});

class ChatroomDummy extends React.Component {

  state = {
    chatLog: [],
    chatBox: "",
  }

  chatDb = async (config) => await window.snet.namedStore({
    name: this.props.roomName,
    type: 'feed',
    options: {
      write: this.props.accessControl
    }
  });

  handleChange = (event) => {
    let draft = event.target.value;
    this.setState({
      chatBox: draft
    })
  }

  handleEnter = (event) => {
    if (event.keyCode == 13 && this.state.chatBox !== "" ) {
      this.handleSend(this.state.chatBox);
    }
  }

  async handleSend(msg) {
    let db = await this.chatDb();
    // do something with this hash later, used to id msgs and deletion from feed
    let msgHash = await db.add(msg);
    if (msgHash) {
      this.setState((prevState) => ({
        chatLog: db.iterator({ limit: -1 }).collect(),
        chatBox: ""
      }))
    }
  }

  async updateMsgs() {
    let db = await this.chatDb();
    let msgs = db.iterator({ limit: -1 }).collect();
    this.setState({
      chatLog: msgs
    })
  }

  async componentDidMount() {
    // ipfsNode.on('error', (e) => console.error(e))
    // ipfsNode.on('ready', async () => {
    //
    //   let { roomName, accessControl } = this.props;
    //   let chatConfig = {
    //     name: roomName,
    //     type: 'feed',
    //     options: {
    //       write: accessControl
    //     }
    //   }
    //
    //   // still probably pretty bad but good enough for now?
    //   let db = await this.chatDb();
    //   db.events.on('replicated', (address) => this.updateMsgs())
    //
    //   // this is bad but we will come back
    //   // this.db = await snet.namedStore(roomName);
    //   // this.
    //
    //
    //   if (db && (this.state.chatLog.length < db.iterator({ limit: -1 }).collect())) {
    //     this.setState({
    //       chatLog: db.iterator({ limit: -1 }).collect()
    //     })
    //   }
    // })
  }

  render() {
    const { classes, dbConfig } = this.props;
    const { chatLog, chatBox } = this.state;

    return (
      <div className={classes.wrapper}>
        <div className={classes.toolbar}>
        </div>
        <div className={classes.chat}>
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
    );
  }
}

// const mapStateToProps = function(store) {
//   return {
//   };
// }
//
// const mapDispatchToProps = function(store) {
//   return {
//   };
// }

ChatroomDummy.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ChatroomDummy);
