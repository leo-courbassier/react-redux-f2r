import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import moment from 'moment';

class Recurring extends Component {

  componentWillMount() {
    if (!this.props.appState.recurringPaymentLoaded) {
      this.props.load();
    }
  }

  render() {
    const { recurring } = this.props.appState;

    return (
      <div className="paymentrecurring-panel">
        {recurring.length < 1 && (
          <div>None currently setup.</div>
        )}
        {recurring.length > 0 && (
          <BS.Table className="data-table" striped bordered responsive>
            <thead>
              <tr>
                <td>Type</td>
                <td>Amount</td>
                <td>{`Date Billed`}</td>
                <td>Account</td>
              </tr>
            </thead>
            <tbody>
              {recurring.map(item => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>${item.value}</td>
                  <td>{moment(item.payment_date).format('Do') + ' of month'}</td>
                  <td>{item.payer_acct_name}</td>
                </tr>
              ))}
            </tbody>
          </BS.Table>
        )}
      </div>
    );
  }

}

export default Recurring;
