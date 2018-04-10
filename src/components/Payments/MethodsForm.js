import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';

import Loader from '../../Loader';

class MethodsForm extends Component {

  render() {
    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="dashboardPaymentMethodsForm">
        <div className="paymentmethodsform-panel">
          <div className="section">Edit</div>
          <div></div>
        </div>
      </Loader>
    );
  }

}

export default MethodsForm;
