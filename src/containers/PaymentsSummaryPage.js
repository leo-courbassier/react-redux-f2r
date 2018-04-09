import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PaymentsMethodsContainer from '../containers/Payments/PaymentsMethodsContainer';
import PaymentsCenterContainer from '../containers/Payments/PaymentsCenterContainer';

class PaymentsSummaryPage extends Component {
  render() {
    return (
      <div>
        <PageTitle>My Payments {'>'} Summary</PageTitle>

        <PaymentsMethodsContainer />

        <PaymentsCenterContainer />

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
