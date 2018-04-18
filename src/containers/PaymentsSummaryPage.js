import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PaymentsMethodsContainer from '../containers/Payments/PaymentsMethodsContainer';
import PaymentsCenterContainer from '../containers/Payments/PaymentsCenterContainer';
import PaymentsRecurringContainer from '../containers/Payments/PaymentsRecurringContainer';
import PaymentsHistoryContainer from '../containers/Payments/PaymentsHistoryContainer';

class PaymentsSummaryPage extends Component {
  render() {
    return (
      <div>
        <PageTitle>My Payments {'>'} Summary</PageTitle>

        <PaymentsMethodsContainer />

        <PaymentsCenterContainer />

        <PaymentsRecurringContainer />

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
)(PaymentsSummaryPage);
