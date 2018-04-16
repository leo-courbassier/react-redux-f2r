import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Visibility from 'visibilityjs';
import _ from 'lodash';
import NavBar from '../components/NavBar';

import * as loginActions from '../actions/loginActions';
import * as actions from '../actions/notificationActions';
import { POLLING_INTERVALS } from '../constants/App';

class NavBarContainer extends Component {

  componentWillMount() {
    // https://github.com/ai/visibilityjs
    this.timers.messages = Visibility.every(
      POLLING_INTERVALS.messages, () => {
        this.updateMessages();
      }
    );
  }

  componentWillUpdate() {
    if (!this.checked.alerts) this.updateAlerts();
    if (!this.checked.messages) this.updateMessages();
  }

  componentWillUnmount() {
    Visibility.stop(this.timers.messages);
  }

  timers = {
    messages: null
  }

  checked = {
    alerts: false,
    messages: false
  }

  updateAlerts() {
    if (this.context.store.getState().loginAppState.authorized) {
      this.checked.alerts = true;
      this.props.actions.updateAlertsCount(() => {
        this.props.actions.updateAlerts();
      });
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
    const alerts = _.get(this.props, 'appState.alerts', false);
    return alerts && (
      <NavBar
        logout={loginActions.logout()}
        alerts={alerts}
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
