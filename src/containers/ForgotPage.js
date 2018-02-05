import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import ForgotForm from '../components/ForgotForm';

import * as actions from '../actions/forgotActions';


class ForgotPage extends Component {

  componentDidMount(){

  }

  componentWillUnmount () {
    this.props.actions.clearForgotForm();
  }

  render() {
    return (
      <ForgotForm
        updateForgotForm={this.props.actions.updateForgotForm}
        forgot={this.props.actions.forgot}
        appState={this.props.appState}
        store={this.context.store.getState().forgotAppState}
      />
    );
  }
}

ForgotPage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired
};

ForgotPage.contextTypes = {
  store: PropTypes.object
};


function mapStateToProps(state) {
  return {
    appState: state.forgotAppState
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
)(ForgotPage);
