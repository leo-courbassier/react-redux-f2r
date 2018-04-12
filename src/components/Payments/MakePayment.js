import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import moment from 'moment';

import Loader from '../Loader';
import MakePaymentForm from './MakePaymentForm';

class MakePayment extends Component {

  componentWillMount() {
    if (!this.props.appState.makePaymentLoaded) {
      this.props.load();
    }
  }

  sendPayment({ recipient, amount, source, details }) {
    const payload = {
      "currency": "USD",
      "value": amount,
      "acct_id": source,
      "payee_id": recipient,
      "description": details
    };
    return this.props.sendPayment(payload);
  }

  render() {
    const { appState, close } = this.props;
    const { tenants, fundingSources, makePaymentSuccess, makePaymentError } = this.props.appState;

    return (
      <div className="paymentmake-panel">
        <Loader appState={appState} statusType="loading" statusAction="paymentMake">
          <div className="section">Make a Payment</div>
          <MakePaymentForm
            onSubmit={this.sendPayment.bind(this)}
            tenants={tenants}
            fundingSources={fundingSources}
            makePaymentSuccess={makePaymentSuccess}
            makePaymentError={makePaymentError}
            close={close}
          />
        </Loader>

      </div>
    );
  }

}

export default MakePayment;
