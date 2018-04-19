import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import * as BS from 'react-bootstrap';

import Loader from '../Loader';
import Compose from './Compose';
import InboxMessages from './InboxMessages';
import ViewMessage from './ViewMessage';

class Inbox extends Component {

  static propTypes = {
    appState: PropTypes.object.isRequired,
    folder: PropTypes.string.isRequired,
    messageId: PropTypes.string
  }

  closeMessage() {
    window.history.go(-1);
    if (this.props.folder === 'inbox') {
      this.props.resetReply();
    }
  }

  renderInboxContent() {
    if (this.props.folder === 'compose') {
      return (
        <Compose
          appState={this.props.appState}
          load={this.props.loadCompose}
          keypress={this.props.composeKeypress}
          updateTo={this.props.updateTo}
          updateToUserId={this.props.updateToUserId}
          recipientId={this.props.recipientId}
          send={this.props.sendMessage}
          />
      );
    }

    if (typeof this.props.messageId !== 'undefined') {
      return (
        <ViewMessage
          appState={this.props.appState}
          close={this.closeMessage.bind(this)}
          id={this.props.messageId}
          folder={this.props.folder}
          load={this.props.loadMessage}
          markAsRead={this.props.markAsRead}

          replyKeypress={this.props.replyKeypress}
          sendReply={this.props.sendReply}
          resetReply={this.props.resetReply}
          />
      );
    }

    if (this.props.folder === 'inbox' || this.props.folder === 'sent') {
      // key prop forces InboxMessages to re-render when moving between folders
      return (
        <InboxMessages
          key={this.props.folder}
          appState={this.props.appState}
          folder={this.props.folder}
          current={this.props.appState[`${this.props.folder}Current`]}
          messages={this.props.appState[this.props.folder]}
          prevPage={() => { this.props.prevPage(this.props.folder); }}
          nextPage={() => { this.props.nextPage(this.props.folder); }}
          selectMessage={this.props.selectMessage}
          deleteMessages={this.props.deleteMessages}
          updateUnreadCount={this.props.updateUnreadCount}
          updateNewMessages={this.props.updateNewMessages}
          newInboxMessages={this.props.newMessages}
          load={this.props.loadMessages}
          />
      );
    }
  }

  render() {
    const messages = this.props.appState.messages;
    const folder = this.props.folder;
    const isLoading = this.props.appState.status.loading[folder] === true;

    return (
      <div className="inbox">
        <BS.Col sm={2} className="inbox-column">
          <ul className="inbox-nav">
            <li>
              <Link
                to="/messages"
                className={folder === 'inbox' ? 'active' : ''}>
                Inbox
              </Link>
            </li>
            <li>
              <Link
                to="/messages/sent"
                className={folder === 'sent' ? 'active' : ''}>
                Sent
              </Link>
            </li>
          </ul>
        </BS.Col>
        <BS.Col sm={10} className="inbox-column">
          <div className="clearfix">
            <div className="pull-left">
              <div className="page-heading">My Messages</div>
            </div>
            <div className="pull-right">
              {folder !== 'compose' && !isLoading && (
                <BS.Button
                  onClick={() => { browserHistory.push('/messages/compose'); }}
                  bsStyle="success">
                  Compose
                </BS.Button>
              )}
              {folder === 'compose' && !isLoading && (
                <BS.Button
                  onClick={() => {
                    this.props.resetCompose();
                    browserHistory.push('/messages');
                  }}
                  bsStyle="success">
                  Close
                </BS.Button>
              )}
            </div>
          </div>
          <div className="inbox-content">
            {this.renderInboxContent()}
          </div>
        </BS.Col>
      </div>
    );
  }

}

export default Inbox;
