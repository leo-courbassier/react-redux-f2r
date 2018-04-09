import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import * as actions from '../actions/paymentsActions';
import HighLightsColumn from '../components/account/HighLightsColumn';

class PaymentsPage extends Component {

  render() {
    let {children, paymentsState} = this.props;

    return (
      <div className="payments-page">
        <div className="panels">
          {children}
        </div>
      </div>
    );
  }
}

PaymentsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  paymentsState: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    paymentsState: state.paymentsAppState
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
)(PaymentsPage);
