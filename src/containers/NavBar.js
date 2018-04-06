import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Visibility from 'visibilityjs';

import NavBar from '../components/NavBar';

import * as loginActions from '../actions/loginActions';
import * as actions from '../actions/notificationActions';
import { POLLING_INTERVALS } from '../constants/App';

class NavBarContainer extends Component {

  timers = {
    messages: null
  }

  checked = {
    messages: false
  }

  componentWillMount() {
    // https://github.com/ai/visibilityjs
    this.timers.messages = Visibility.every(
      POLLING_INTERVALS.messages, () => {
        this.updateMessages();
      }
    );
  }

  componentWillUnmount() {
    Visibility.stop(this.timers.messages);
  }

  componentWillUpdate() {
    if (!this.checked.messages) this.updateMessages();
  }

  updateMessages() {
    if (this.context.store.getState().loginAppState.authorized) {
      this.checked.messages = true;
      this.props.actions.updateMessages();
    }
  }

  render() {
    return (
      <NavBar
        logout={loginActions.logout()}
        unreadMessages={this.props.appState.messages.unread}
        loginState={this.props.loginState}
        store={this.context.store}
        />
    );
  }

}

NavBarContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired
};

NavBarContainer.contextTypes = {
  store: PropTypes.object
};

function mapStateToProps(state) {
  return {
    appState: state.notificationAppState,
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
)(NavBarContainer);
