import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions/paymentsActions';
import Loader from '../../components/Loader';
import TabEditablePanel from '../../components/Payments/TabEditablePanel';
import Methods from '../../components/Payments/Methods';
import MethodsForm from '../../components/Payments/MethodsForm';

class PaymentMethodsContainer extends Component {

  render() {
    const {appState, actions} = this.props;
    const editMode = appState.editMode.methods;
    const toggleEditMode = () => actions.editModeUpdate('methods', !editMode);

    return (
      <TabEditablePanel title="Payment Methods"
                        editMode={editMode}
                        onClick={toggleEditMode}
      >
        <Loader appState={appState} statusType="loading" statusAction="paymentMethods">
          {editMode ? (
            <MethodsForm
              paymentsState={appState}
              load={actions.loadPaymentsMethodsForm}
              createCustomer={actions.createCustomer}
              loadFundingSources={actions.loadFundingSources}
              loadCreditCards={actions.loadCreditCards}
              removeFundingSource={actions.removeFundingSource}
              removeCreditCard={actions.removeCreditCard}
              setDefaultFundingSource={actions.setDefaultFundingSource}
              getCityList={actions.getCityList}
            />
          ) : (
            <Methods
              appState={appState}
              load={actions.loadPaymentsMethods}
            />
          )}
        </Loader>
      </TabEditablePanel>
    );
  }

}

function mapStateToProps(state) {
  return {
    appState: state.paymentsAppState
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
)(PaymentMethodsContainer);
