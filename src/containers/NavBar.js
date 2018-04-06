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
    alerts: false,
    alertsCount: false,
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
    if (!this.checked.alerts) this.updateAlerts();
    if (!this.checked.alertsCount) this.updateAlertsCount();
    if (!this.checked.messages) this.updateMessages();
  }

  updateAlerts() {
    if (this.context.store.getState().loginAppState.authorized) {
      this.checked.alerts = true;
      this.props.actions.updateAlerts();
    }
  }

  updateAlertsCount() {
    if (this.context.store.getState().loginAppState.authorized) {
      this.checked.alertsCount = true;
      this.props.actions.updateAlertsCount();
    }
  }

  updateMessages() {
    if (this.context.store.getState().loginAppState.authorized) {
      this.checked.messages = true;
      this.props.actions.updateMessages();
    }
  }

  deleteAlert(id) {
    this.props.actions.deleteAlert(id, () => {
      let page = 0;
      let forceReload = true;
      this.props.actions.updateAlerts(page, forceReload);
    });
  }

  render() {
    return (
      <NavBar
        logout={loginActions.logout()}
        alerts={this.props.appState.alerts}
        alertsCount={this.props.appState.alertsCount}
        alertsPage={this.props.appState.alertsPage}
        updateAlerts={this.props.actions.updateAlerts}
        deleteAlert={this.deleteAlert.bind(this)}
        unreadMessages={this.props.appState.messages.unread}
        loginState={this.props.loginState}
        appState={this.props.appState}
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
