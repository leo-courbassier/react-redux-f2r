import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import * as BS from 'react-bootstrap';

import * as actions from '../actions/loginActions';


class AccountSummaryPage extends Component {
  render() {
    return (
      <div>
        Summary page
      </div>
    );
  }
}

AccountSummaryPage.propTypes = {
  actions: PropTypes.object.isRequired,
  //appState: PropTypes.object.isRequired
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
)(AccountSummaryPage);
