import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions/paymentsActions';
import TabEditablePanel from '../../components/Payments/TabEditablePanel';

class PaymentsCenterContainer extends Component {

  render() {
    const {paymentsState, actions} = this.props;
    const editMode = paymentsState.editMode.center;
    const toggleEditMode = () => actions.editModeUpdate('center', !editMode);
    const store = this.context.store.getState();

    return (
      <TabEditablePanel title="Payment Center"
                        editMode={editMode}
                        onClick={toggleEditMode}
      >
        {editMode ? (
          <div>Edit mode</div>
        ) : (
          <div>View mode</div>
        )}
      </TabEditablePanel>
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
