import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as accountActions from '../../actions/accountActions';
import TabEditablePanel from '../../components/account/TabEditablePanel';
import ProfileInfo from '../../components/account/ProfileInfo';

class ProfileInfoContainer extends Component {
  componentWillMount() {
    this.props.actions.loadProfileInfo();
  }
  render() {
    let {appState, actions} = this.props;
    let editMode = appState.editMode.profile;
    let updateEditMode = () => actions.editModeUpdate('profile', !editMode);
    let onSubmit = (/*formData*/) => {
      updateEditMode();
    };

    return (
      <TabEditablePanel title="Profile"
        editMode={editMode}
        onClick={updateEditMode}
      >
        {appState.profile &&
          <ProfileInfo profile={appState.profile}
           editMode={editMode}
           onSubmit={onSubmit}
          />
        }
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
