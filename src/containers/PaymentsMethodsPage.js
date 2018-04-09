import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PaymentsMethodsContainer from '../containers/Payments/PaymentsMethodsContainer';

class PaymentsMethodsPage extends Component {
  render() {
    return (
      <div>
        <PageTitle>My Payments {'>'} Methods</PageTitle>

        <PaymentsMethodsContainer />

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
)(PaymentsMethodsPage);
