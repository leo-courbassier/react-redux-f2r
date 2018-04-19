import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as BS from 'react-bootstrap';

import Loader from '../components/Loader';
import SidebarContainer from '../containers/SidebarContainer';

import Inbox from '../components/messages/Inbox';

import * as actions from '../actions/messagesActions';
import { updateMessages, updateNewMessages } from '../actions/notificationActions';

class MessagesPage extends Component {

  getFolder() {
    if (typeof this.props.routeParams.folder === 'undefined') {
      return 'inbox';
    }
    return this.props.routeParams.folder;
  }

  showDashboardLinks() {
    const userInfo = this.props.loginState.userInfo;
    return userInfo && userInfo.userDetails && userInfo.userDetails.ttServiceLevel !== 'NONE';
  }

  render() {
    return (
      <div className="messages-page">
        <BS.Col xsHidden sm={2} md={2} className="sidebar">
          <SidebarContainer />
        </BS.Col>
        <BS.Col xs={12} sm={10} md={10} className="panels">
          <Loader appState={this.props.appState} statusType="loading" statusAction="messages">
            <Inbox
              appState={this.props.appState}

              folder={this.getFolder()}
              messageId={this.props.routeParams.id}
              recipientId={this.props.routeParams.id}

              updateUnreadCount={() => { this.context.store.dispatch(updateMessages()); }}
              updateNewMessages={(newMessages) => { this.context.store.dispatch(updateNewMessages(newMessages)); }}
              newMessages={this.context.store.getState().notificationAppState.messages.new}

              loadMessages={this.props.actions.loadMessages}
              prevPage={this.props.actions.prevPage}
              nextPage={this.props.actions.nextPage}

              selectMessage={this.props.actions.selectMessage}
              deleteMessages={this.props.actions.deleteMessages}
              loadMessage={this.props.actions.loadMessage}
              markAsRead={this.props.actions.markAsRead}

              loadCompose={this.props.actions.loadCompose}
              composeKeypress={this.props.actions.updateComposeForm}
              updateTo={this.props.actions.updateTo}
              updateToUserId={this.props.actions.updateToUserId}
              sendMessage={this.props.actions.sendMessage}
              resetCompose={this.props.actions.resetCompose}

              replyKeypress={this.props.actions.updateReplyForm}
              sendReply={this.props.actions.sendReply}
              resetReply={this.props.actions.resetReply}
              />
          </Loader>
        </BS.Col>
      </div>
    );
  }

}

MessagesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
  loginState: PropTypes.object.isRequired
};

MessagesPage.contextTypes = {
  store: PropTypes.object
};

function mapStateToProps(state) {
  return {
    appState: state.messagesAppState,
    loginState: state.loginAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesPage);
