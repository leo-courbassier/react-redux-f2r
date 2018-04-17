import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Loader from '../../Loader';
import TabEditablePanel from '../../account/TabEditablePanel';
import TabPanel from '../../TabPanel';
import PageTitle from '../../PageTitle';
import PropertyForm from '../../../containers/Properties/PropertyFormContainer';
import PropertyInfo from '../PropertyInfo';
import PropertyLeases from '../PropertyLeases';
import PropertyTenants from '../PropertyTenants';

export default class PropertyProfile extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    geoState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    geoActions: PropTypes.object.isRequired,
    propertyId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired
  };

  componentWillMount() {
    const { propertyId, actions, geoActions, appState: { propertyProfile: property } } = this.props;
    actions.loadPropertyProfile(propertyId);
    actions.loadPropertyLeases(propertyId);
    geoActions.loadStateList();
    geoActions.loadCityList(property.state);
  }

  get editMode() {
    const { appState } = this.props;
    return appState.editMode.propertyProfile;
  }

  updateEditMode = () => {
    const { actions } = this.props;
    actions.editModeUpdate('propertyProfile', !this.editMode);
  }

  handleSavePropertyDetails = (payload) => {
    const { actions } = this.props;
    actions.savePropertyDetails(payload, () => {
      actions.editModeUpdate('propertyProfile', false);
    });
  }

  render() {
    const { appState, geoState, actions, geoActions, propertyId, goTo } = this.props;
    const editMode = this.editMode;

    const propertyTenants = _.reduce(
      appState.propertyLeases,
      (tenants, item) => (
        _.concat(
          tenants,
          _.map(item.renterList, (renter) => (
            _.set(renter, 'leaseId', item.id)
          ))
        )
      ),
      []
    );

    return (
      <div>
        <TabEditablePanel title="Property Infomation"
          editMode={editMode}
          onClick={this.updateEditMode}
        >
          <Loader appState={this.props.appState} statusType="loading" statusAction="propertyProfile">
            {
              editMode
              ? <PropertyForm appState={appState} geoState={geoState}
                savePropertyDetails={this.handleSavePropertyDetails}
                propertyId={propertyId}
                geoActions={geoActions}
                upload={actions.uploadPropertyPic} />
              : <PropertyInfo property={appState.propertyProfile} />
            }
          </Loader>
        </TabEditablePanel>
        <TabPanel title="Lease Information">
          <Loader appState={this.props.appState} statusType="loading" statusAction="propertyLeases">
            <PropertyLeases propertyLeases={appState.propertyLeases} goTo={goTo} />
          </Loader>
        </TabPanel>
        <TabPanel title="Tenant Information">
          <Loader appState={this.props.appState} statusType="loading" statusAction="propertyTenants">
            <PropertyTenants propertyTenants={propertyTenants} goTo={goTo} />
          </Loader>
        </TabPanel>
      </div>
    );
  }
}
