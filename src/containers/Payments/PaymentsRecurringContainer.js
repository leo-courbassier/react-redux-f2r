import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions/paymentsActions';
import Loader from '../../components/Loader';
import TabEditablePanel from '../../components/Payments/TabEditablePanel';
import Recurring from '../../components/Payments/Recurring';
import RecurringForm from '../../components/Payments/RecurringForm';

class PaymentsRecurringContainer extends Component {

  render() {
    const {appState, actions} = this.props;
    const editMode = appState.editMode.recurring;
    const toggleEditMode = () => actions.editModeUpdate('recurring', !editMode);

    return (
      <TabEditablePanel title="Recurring Payments"
                        editMode={editMode}
                        onClick={toggleEditMode}
      >
        <Loader appState={appState} statusType="loading" statusAction="paymentRecurring">
          {editMode ? (
            <RecurringForm
              appState={appState}
              removeRecurringPayment={actions.removeRecurringPayment}
            />
          ) : (
            <Recurring
              appState={appState}
              load={actions.loadPaymentsRecurring}
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
)(PaymentsRecurringContainer);
