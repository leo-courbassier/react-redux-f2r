import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';

class Methods extends Component {

  componentWillMount() {
    if (!this.props.appState.loaded) {
      this.props.load();
    }
  }

  render() {
    const { fundingSources, creditCards } = this.props.appState;

    return (
      <div className="paymentmethods-panel">
        <div className="section">Bank Accounts</div>
        {fundingSources.length < 1 && (
          <div>No accounts added.</div>
        )}
        {fundingSources.length > 0 && (
          <BS.Table className="data-table" striped bordered responsive>
            <thead>
              <tr>
                <td>Bank Account</td>
                <td>Status</td>
                <td>Default</td>
              </tr>
            </thead>
            <tbody>
              {fundingSources.map((source, i) => (
                <tr key={i}>
                  <td>{source.name}</td>
                  <td>Verified</td>
                  <td>{source.isDefault ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </BS.Table>
        )}
        <div className="section">Credit/Debit Card</div>
        {creditCards.length < 1 && (
          <div>No card added.</div>
        )}
        {creditCards.length > 0 && (
          <BS.Table className="data-table" striped bordered responsive>
            <thead>
              <tr>
                <td>Card</td>
                <td>Type</td>
                <td>Account Number</td>
                <td>Expiration</td>
              </tr>
            </thead>
            <tbody>
              {creditCards.map((card, i) => (
                <tr key={i}>
                  <td>{card.brand}</td>
                  <td>{card.funding.charAt(0).toUpperCase() + card.funding.slice(1)}</td>
                  <td>XXXX XXXX XXXX {card.last4}</td>
                  <td>{`${card.expMonth} / ${card.expYear}`}</td>
                </tr>
              ))}
            </tbody>
          </BS.Table>
        )}
      </div>
    );
  }

}

export default Methods;
