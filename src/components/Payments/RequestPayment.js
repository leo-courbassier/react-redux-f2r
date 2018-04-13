import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import moment from 'moment';

import Loader from '../Loader';
import RequestPaymentForm from './RequestPaymentForm';

class RequestPayment extends Component {

  componentWillMount() {
    if (!this.props.appState.requestPaymentLoaded) {
      this.props.load();
    }
  }

  sendPayment({ lease, amount, type, frequency, recipients, details }) {
    for (let i = 0; i < recipients.length; i++) {
      // remove $ and ,
      const newAmount = amount.toString().trim().replace(/\$|,/g, '');
      
      const payload = {
        "amount": newAmount,
        "details": details || '',
        "frequency": frequency,
        "type": type,
        "userId": recipients[i]
      };
      if (i === recipients.length - 1) {
        return this.props.requestPayment(payload);
      } else {
        this.props.requestPayment(payload);
      }
    }
  }

  render() {
    const { appState, close } = this.props;
    const { leases, tenants, requestPaymentSuccess, requestPaymentError } = this.props.appState;

    return (
      <div className="paymentrequest-panel">
        <Loader appState={appState} statusType="loading" statusAction="paymentRequest">
          <div>
            <div className="section">Request a Payment</div>
            {(leases.length > 0 && tenants.length > 0) ? (
              <RequestPaymentForm
                onSubmit={this.sendPayment.bind(this)}
                leases={leases}
                tenants={tenants}
                requestPaymentSuccess={requestPaymentSuccess}
                requestPaymentError={requestPaymentError}
                close={close}
              />
            ) : (
              <div>You need to create a lease and invite tenants to it first.</div>
            )}
          </div>
        </Loader>

      </div>
    );
  }

}

export default RequestPayment;
