import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PaymentsHistoryContainer from '../containers/Payments/PaymentsHistoryContainer';

class PaymentsHistoryPage extends Component {
  render() {
    return (
      <div>
        <PageTitle>{'My Payments > Past Payments'}</PageTitle>

        <PaymentsHistoryContainer />

      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentsHistoryPage);
