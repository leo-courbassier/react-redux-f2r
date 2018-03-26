import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as accountActions from '../../actions/accountActions';
import TabEditablePanel from '../../components/account/TabEditablePanel';
import ProfileInfo from '../../components/account/ProfileInfo';
import ProfileForm from '../../containers/account/ProfileFormContainer';

import Loader from '../../components/Loader';

class ProfileInfoContainer extends Component {
  componentWillMount() {
    this.props.actions.loadProfileInfo();
  }
  render() {
    let {appState, actions} = this.props;
    let editMode = appState.editMode.profile;
    let updateEditMode = () => actions.editModeUpdate('profile', !editMode);

    return (
      <TabEditablePanel title="Profile"
        editMode={editMode}
        onClick={updateEditMode}
      >

        <Loader appState={this.props.appState} statusType="loading" statusAction="profile">
          {
            editMode
            ? <ProfileForm appState={appState}
                saveUserDetails={actions.saveUserDetails}
                upload={actions.uploadProfilePic} />
            : <ProfileInfo profile={appState.profile} />
          }
        </Loader>
      </TabEditablePanel>
    );
  }
}

function mapStateToProps(state) {
  return {
    appState: state.accountAppState
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
)(ProfileInfoContainer);
