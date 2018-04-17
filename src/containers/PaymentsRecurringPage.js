import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PaymentsRecurringContainer from '../containers/Payments/PaymentsRecurringContainer';

class PaymentsRecurringPage extends Component {
  render() {
    return (
      <div>
        <PageTitle>My Payments {'>'} Methods</PageTitle>

        <PaymentsRecurringContainer />

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
)(PaymentsRecurringPage);
