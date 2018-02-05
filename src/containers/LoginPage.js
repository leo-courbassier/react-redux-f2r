import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import LoginForm from '../components/LoginForm';

import * as actions from '../actions/loginActions';


class LoginPage extends Component {

  componentDidMount(){

  }

  componentWillUnmount () {
    this.props.actions.clearLoginForm();
  }

  render() {
    return (
      <LoginForm
        updateLoginForm={this.props.actions.updateLoginForm}
        login={this.props.actions.login}
        appState={this.props.appState}
        store={this.context.store.getState().loginAppState}
      />
    );
  }
}

LoginPage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired
};

LoginPage.contextTypes = {
  store: PropTypes.object
};

function mapStateToProps(state) {
  return {
    appState: state.loginAppState
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
)(LoginPage);
