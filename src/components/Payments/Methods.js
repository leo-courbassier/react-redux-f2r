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
        <div>
          {fundingSources.map((source, i) => (
            <div key={i}>
              {source.name}
            </div>
          ))}
        </div>
        <div className="section">Credit/Debit Card</div>
        {creditCards.length < 1 && (
          <div>No card added.</div>
        )}
        <div>
          {creditCards.map((card, i) => (
            <div key={i}>
              {card.brand}
            </div>
          ))}
        </div>
      </div>
    );
  }

}

export default Methods;
