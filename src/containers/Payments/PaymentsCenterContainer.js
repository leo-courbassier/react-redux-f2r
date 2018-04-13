import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as BS from 'react-bootstrap';

import * as actions from '../../actions/paymentsActions';
import Panel from '../../components/Payments/Panel';
import MakePayment from '../../components/Payments/MakePayment';
import RequestPayment from '../../components/Payments/RequestPayment';

class PaymentsCenterContainer extends Component {

  state = {
    showOptions: true,
    showMakePayment: false,
    showRequestPayment: false
  }

  openScreen(type) {
    if (type === 'makePayment') {
      this.setState({
        showOptions: false,
        showMakePayment: true,
        showRequestPayment: false
      });
    }

    if (type === 'requestPayment') {
      this.setState({
        showOptions: false,
        showRequestPayment: true,
        showMakePayment: false
      });
    }
  }

  closeScreen() {
    this.setState({
      showOptions: true,
      showMakePayment: false,
      showRequestPayment: false
    });
  }

  render() {
    const {paymentsState, actions} = this.props;
    const editMode = paymentsState.editMode.center;
    const toggleEditMode = () => actions.editModeUpdate('center', !editMode);
    const store = this.context.store.getState();

    return (
      <Panel title="Payment Center">
        {this.state.showOptions && (
          <div className="payments-center-options">
            <div className="payments-center-options-item">
              <BS.Button
                onClick={this.openScreen.bind(this, 'makePayment')}
                bsStyle="primary">
                Make a Payment
              </BS.Button>
            </div>
            <div className="payments-center-options-item">
              <BS.Button
                onClick={this.openScreen.bind(this, 'requestPayment')}
                bsStyle="success">
                Request a Payment
              </BS.Button>
            </div>
          </div>
        )}
        {this.state.showMakePayment && (
          <MakePayment
            appState={paymentsState}
            load={actions.loadPaymentsMake}
            sendPayment={actions.sendPayment}
            close={this.closeScreen.bind(this)}
          />
        )}
        {this.state.showRequestPayment && (
          <RequestPayment
            appState={paymentsState}
            load={actions.loadPaymentsRequest}
            requestPayment={actions.requestPayment}
            close={this.closeScreen.bind(this)}
          />
        )}
      </Panel>
    );
  }

}

PaymentsCenterContainer.contextTypes = {
  store: PropTypes.object
};

function mapStateToProps(state) {
  return {
    paymentsState: state.paymentsAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentsCenterContainer);
