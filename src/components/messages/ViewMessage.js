import React, { Component } from 'react';
import * as BS from 'react-bootstrap';
import moment from 'moment';

import Loader from '../Loader';
import ReplyForm from './ReplyForm';

import * as DATE from '../../utils/date';

class ViewMessage extends Component {

  state = {
    showReply: false
  }

  componentWillMount() {
    // Message data is already available from inbox/outbox endpoints, so no need to load separately.
    // const messageExists = this.props.id in this.props.appState.singleMessages[this.props.folder];
    // const messageLoaded = messageExists && !this.props.appState.singleMessages[this.props.id].loaded;
    // if (!messageExists || !messageLoaded) {
    //   this.props.load(this.props.folder, this.props.id);
    // }

    // Mark as read
    // This would normally be set as a callback of this.props.load
    const isUnread = this.props.appState.singleMessages[this.props.folder][this.props.id].newMessageFlag;
    if (isUnread) this.props.markAsRead(this.props.folder, this.props.id);
  }

  openReplyBox() {
    this.setState({
      showReply: true
    });
  }

  closeReplyBox() {
    this.props.resetReply();
    this.setState({
      showReply: false
    });
  }

  getTime(date) {
    return moment(date).format(
      DATE.isToday(date) ? 'h:mma' : 'MM/DD/YY'
    );
  }

  // https://medium.com/@kevinsimper/react-newline-to-break-nl2br-a1c240ba746
  nl2br(text) {
    return text.split('\n').map(function(item) {
      return <span>{item}<br /></span>;
    });
  }

  render() {
    const folder = this.props.folder;
    const message = this.props.appState.status.loading['singleMessage'] !== true ?
                    this.props.appState.singleMessages[this.props.folder][this.props.id] :
                    null;

    return (
      <div className="view">
        <Loader appState={this.props.appState} statusType="loading" statusAction="singleMessage">
          {message && (
            <div>
              <div className="view-header">
                <BS.Button
                  onClick={this.props.close}>
                  Close Message
                </BS.Button>
              </div>
              <div className="view-content">
                <span className="view-time">{this.getTime(message.tsMessageSent)}</span>
                {folder === 'inbox' ? (
                  <p className="view-heading">From: {message.fromUserFullName}</p>
                ) : (
                  <p className="view-heading">To: {message.toUserFullName}</p>
                )}
                <p className="view-heading">Subject: {message.subject}</p>
                <p className="view-message">{this.nl2br(message.message)}</p>
              </div>
              {folder === 'inbox' && (
                <div className="view-reply">
                  {this.state.showReply ? (
                    <ReplyForm
                      appState={this.props.appState}
                      close={this.closeReplyBox.bind(this)}
                      message={message}
                      keypress={this.props.replyKeypress}
                      send={this.props.sendReply}
                      />
                  ) : (
                    <BS.Button
                      onClick={this.openReplyBox.bind(this)}
                      bsStyle="success">
                      Reply
                    </BS.Button>
                  )}
                </div>
              )}
              <div className="view-footer">
                <BS.Button
                  onClick={this.props.close}>
                  Close Message
                </BS.Button>
              </div>
            </div>
          )}
        </Loader>
      </div>
    );
  }

}

export default ViewMessage;
