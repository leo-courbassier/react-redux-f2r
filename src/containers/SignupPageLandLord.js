import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import SignupFormLord from '../components/SignupFormLord';

import * as actions from '../actions/signupActions';


class SignupPage extends Component {

  componentWillUnmount () {
    this.props.actions.clearSignupForm();
  }

  render() {
    return (
      <SignupFormLord
        updateSignupForm={this.props.actions.updateSignupForm}
        signup={this.props.actions.signup}
        appState={this.props.appState}
      />
    );
  }
}

SignupPage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    appState: state.signupAppState
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
)(SignupPage);
