import React, { Component, PropTypes } from 'react';
import Loader from '../../Loader';
import TabEditablePanel from '../../account/TabEditablePanel';
import PageTitle from '../../PageTitle';
import PropertyForm from '../PropertyForm';
import PropertyInfo from '../PropertyInfo';

export default class PropertyProfile extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    propertyId: PropTypes.number.isRequired
  };

  componentWillMount() {
    const { propertyId, actions } = this.props;
    actions.loadPropertyProfile(propertyId);
  }
  render() {
    const { appState, actions, propertyId } = this.props;
    const editMode = appState.editMode.propertyProfile;
    const updateEditMode = () => actions.editModeUpdate('propertyProfile', !editMode);

    return (
      <TabEditablePanel title="Property Infomation"
        editMode={editMode}
        onClick={updateEditMode}
      >
        <Loader appState={this.props.appState} statusType="loading" statusAction="profile">
          {
            editMode
            ? <PropertyForm property={appState.propertyProfile} />
            : <PropertyInfo property={appState.propertyProfile} />
          }
        </Loader>
      </TabEditablePanel>
    );
  }
}
