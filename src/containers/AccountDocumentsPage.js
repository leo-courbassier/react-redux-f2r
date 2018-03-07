import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../actions/accountActions';
import PageTitle from '../components/account/PageTitle';
import TabEditablePanel from '../components/account/TabEditablePanel';
import DocumentsInfo from '../components/account/DocumentsInfo';

class AccountDocumentsPage extends Component {
  render() {
    let {accountState, actions} = this.props;
    return (
      <div>
        <PageTitle>My Account > Documents</PageTitle>

        <TabEditablePanel title="Documents"
                          editMode={accountState.editMode.documents}
                          onClick={(value) => actions.editModeUpdate('documents', value)}
        >
          <DocumentsInfo accountState={accountState}
                         actions={actions}
                         editMode={accountState.editMode.documents}
          />
        </TabEditablePanel>

      </div>
    );
  }
}

AccountDocumentsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  accountState: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    accountState: state.accountAppState
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
)(AccountDocumentsPage);
