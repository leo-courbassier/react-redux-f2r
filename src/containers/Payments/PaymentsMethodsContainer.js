import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions/paymentsActions';
import TabEditablePanel from '../../components/Payments/TabEditablePanel';

class PaymentAccountsContainer extends Component {

  render() {
    const {paymentsState, actions} = this.props;
    const editMode = paymentsState.editMode.methods;
    const toggleEditMode = () => actions.editModeUpdate('methods', !editMode);
    const store = this.context.store.getState();

    return (
      <TabEditablePanel title="Payment Methods"
                        editMode={editMode}
                        onClick={toggleEditMode}
      >
        {editMode ? (
          <MethodsForm
            appState={paymentsState}
            store={store}
            load={actions.loadPaymentsMethodsForm}
          />
        ) : (
          <Methods
            appState={paymentsState}
            store={store}
            load={actions.loadPaymentsMethods}
          />
        )}
      </TabEditablePanel>
    );
  }

}

PaymentAccountsContainer.contextTypes = {
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
)(PaymentAccountsContainer);
