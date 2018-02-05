import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import ResetForm from '../components/ResetForm';

import * as actions from '../actions/resetActions';


class ResetPage extends Component {

  componentDidMount(){

  }

  componentWillUnmount () {
    this.props.actions.clearResetForm();
  }

  render() {
    return (
      <ResetForm
        token={this.props.routeParams.token}
        updateResetForm={this.props.actions.updateResetForm}
        reset={this.props.actions.reset}
        appState={this.props.appState}
        store={this.context.store.getState().resetAppState}
      />
    );
  }
}

ResetPage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired
};

ResetPage.contextTypes = {
  store: PropTypes.object
};


function mapStateToProps(state) {
  return {
    appState: state.resetAppState
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
)(ResetPage);
