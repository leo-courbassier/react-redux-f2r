import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';

import Loader from '../../Loader';

class Methods extends Component {

  render() {
    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="dashboardPaymentMethods">
        <div className="paymentmethods-panel">
          <div className="section">View</div>
          <div></div>
        </div>
      </Loader>
    );
  }

}

export default Methods;
