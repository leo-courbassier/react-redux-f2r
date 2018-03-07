import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../actions/accountActions';
import PageTitle from '../components/account/PageTitle';
import TabEditablePanel from '../components/account/TabEditablePanel';
import ProfileInfo from '../components/account/ProfileInfo';

class AccountProfilePage extends Component {
  render() {
    let {accountState, actions} = this.props;
    return (
      <div>
        <PageTitle>My Account > Profile</PageTitle>

        <TabEditablePanel title="Profile"
                          editMode={accountState.editMode.profile}
                          onClick={(value) => actions.editModeUpdate('profile', value)}
        >
          <ProfileInfo accountState={accountState}
                       actions={actions}
                       editMode={accountState.editMode.profile}
          />
        </TabEditablePanel>

      </div>
    );
  }
}

AccountProfilePage.propTypes = {
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
)(AccountProfilePage);
