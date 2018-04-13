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
    // remove $ and ,
    const newAmount = amount.toString().trim().replace(/\$|,/g, '');

    const payload = {
      "currency": "USD",
      "value": newAmount,
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
          <div>
            <div className="section">Make a Payment</div>
            {(tenants.length > 0 && fundingSources.length > 0) ? (
              <MakePaymentForm
                onSubmit={this.sendPayment.bind(this)}
                tenants={tenants}
                fundingSources={fundingSources}
                makePaymentSuccess={makePaymentSuccess}
                makePaymentError={makePaymentError}
                close={close}
              />
            ) : (
              <div>
                <div>{tenants.length < 1 && 'You need to create a lease and invite tenants to it first.'}</div>
                <div>{fundingSources.length < 1 && 'You need to add a bank account first.'}</div>
              </div>
            )}
          </div>
        </Loader>

      </div>
    );
  }

}

export default MakePayment;
