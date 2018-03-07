import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as accountActions from '../../actions/accountActions';
import TabEditablePanel from '../../components/account/TabEditablePanel';
import ProfileInfo from '../../components/account/ProfileInfo';

class PasswordInfoContainer extends Component {
  render() {
    let {accountState, accountActions} = this.props;
    let editMode = accountState.editMode.profile;
    let updateEditMode = () => accountActions.editModeUpdate('profile', !editMode);
    let onSubmit = (/*formData*/) => {
      updateEditMode();
    };

    return (
      <TabEditablePanel title="Profile"
                        editMode={editMode}
                        onClick={updateEditMode}
      >
        <ProfileInfo userInfo={accountState.userInfo}
                     editMode={editMode}
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
