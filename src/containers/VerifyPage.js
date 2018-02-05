import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import VerifyForm from '../components/VerifyForm';
import Loader from '../components/Loader';

import * as actions from '../actions/verifyActions';


class VerifyPage extends Component {

  componentDidMount(){
    this.props.actions.decryptToken(this.props.routeParams.token);
  }

  componentWillUnmount () {

  }

  render() {
    return (
      <div className="verify-page">
        <Loader
          appState={this.props.appState}
          statusType="loading"
          statusAction="verifyPage"
        >
          <VerifyForm
            token={this.props.routeParams.token}
            updateVerifyForm={this.props.actions.updateVerifyForm}
            sendVerifyForm={this.props.actions.sendVerifyForm}
            appState={this.props.appState}
            store={this.context.store.getState().verifyAppState}
          />
        </Loader>
      </div>
    );
  }
}

VerifyPage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired
};

VerifyPage.contextTypes = {
  store: PropTypes.object
};


function mapStateToProps(state) {
  return {
    appState: state.verifyAppState
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
)(VerifyPage);
