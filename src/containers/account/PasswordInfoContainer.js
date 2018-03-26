import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as accountActions from '../../actions/accountActions';
import TabEditablePanel from '../../components/account/TabEditablePanel';
import PasswordInfo from '../../components/account/PasswordInfo';
import PasswordForm from '../../containers/account/PasswordFormContainer';

class PasswordInfoContainer extends Component {
  render() {
    let {accountState, accountActions} = this.props;
    let editMode = accountState.editMode.password;
    let updatePasswordEditMode = () => accountActions.editModeUpdate('password', !editMode);
    let onSubmit = (/*formData*/) => {
      updatePasswordEditMode();
    };

    return (
      <TabEditablePanel title="Login/Password"
                        editMode={editMode}
                        onClick={updatePasswordEditMode}
      >
        {
          editMode
          ? <PasswordForm saveAccountLogin={accountActions.saveAccountLogin} />
          : <PasswordInfo userInfo={accountState.userInfo} />
        }
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
