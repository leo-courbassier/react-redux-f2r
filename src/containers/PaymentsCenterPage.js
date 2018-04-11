import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PaymentsCenterContainer from '../containers/Payments/PaymentsCenterContainer';

class PaymentsCenterPage extends Component {
  render() {
    return (
      <div>
        <PageTitle>My Payments {'>'} Center</PageTitle>

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
)(PaymentsCenterPage);
