import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as accountActions from '../../actions/accountActions';
import TabEditablePanel from '../../components/account/TabEditablePanel';
import DocumentsInfo from '../../components/account/DocumentsInfo';

class PasswordInfoContainer extends Component {
  render() {
    let {accountState, accountActions} = this.props;
    let editMode = accountState.editMode.documents;
    let updateEditMode = () => accountActions.editModeUpdate('documents', !editMode);
    let onSubmit = (/*formData*/) => {
      updateEditMode();
    };

    return (
      <TabEditablePanel title="Documents"
                        editMode={editMode}
                        onClick={updateEditMode}
      >
        <DocumentsInfo editMode={editMode}
                       onSubmit={onSubmit}
        />
      </TabEditablePanel>
    );
  }
}

function mapStateToProps(state) {
  return {
    accountState: state.accountAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordInfoContainer);
