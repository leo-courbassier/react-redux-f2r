import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../actions/accountActions';
import PageTitle from '../components/account/PageTitle';
import TabEditablePanel from '../components/account/TabEditablePanel';
import PasswordInfo from '../components/account/PasswordInfo';

class AccountPasswordPage extends Component {
  render() {
    let {accountState, actions} = this.props;
    return (
      <div>
        <PageTitle>My Account > Login/Password</PageTitle>

        <TabEditablePanel title="Login/Password"
                          editMode={accountState.editMode.password}
                          onClick={(value) => actions.editModeUpdate('password', value)}
        >
          <PasswordInfo  accountState={accountState}
                         actions={actions}
                         editMode={accountState.editMode.password}
          />
        </TabEditablePanel>

      </div>
    );
  }
}

AccountPasswordPage.propTypes = {
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
)(AccountPasswordPage);
