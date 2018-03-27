import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as accountActions from '../../actions/accountActions';
import TabEditablePanel from '../../components/account/TabEditablePanel';
import Documents from '../../components/account/Documents';
import DocumentsForm from '../../components/account/DocumentsForm';
import DocumentsPaymentForm from './DocumentsPaymentFormContainer';

class DocumentsInfoContainer extends Component {
  context
  render() {
    const {accountState, actions} = this.props;
    const editMode = accountState.editMode.documents;
    const toggleEditMode = () => actions.editModeUpdate('documents', !editMode);
    const onSubmit = (/*formData*/) => {
      toggleEditMode();
    };
    const store = this.context.store.getState();

    return (
      <TabEditablePanel title="Documents"
                        editMode={editMode}
                        onClick={toggleEditMode}
      >
        {accountState.paymentsReceived
          ? editMode
            ? <DocumentsForm
              appState={accountState}
              store={store}
              load={actions.loadAccountDocumentsForm}
              update={actions.updateAccountDocumentsForm}
              upload={actions.uploadAccountDocumentsFile}
              delete={actions.deleteAccountDocumentsFile}
              openFile={actions.openAccountDocumentsFile}
              updateF2RScore={actions.updateF2RScore}
              />
            : <Documents
            id="documents"
            ref="documents"
            appState={accountState}
            store={store}
            load={actions.loadAccountDocuments}
            openFile={actions.openAccountDocumentsFile}
            showEditButton={toggleEditMode}
            onPanelLoaded={function () {}}
            />
          : <DocumentsPaymentForm receiveDocumentPayment={actions.receiveDocumentPayment} />}

      </TabEditablePanel>
    );
  }
}

DocumentsInfoContainer.contextTypes = {
  store: PropTypes.object
};

function mapStateToProps(state) {
  return {
    accountState: state.accountAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(accountActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentsInfoContainer);
