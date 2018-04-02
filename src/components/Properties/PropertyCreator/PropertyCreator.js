import React, { Component, PropTypes } from 'react';
import Loader from '../../Loader';
import TabPanel from '../../TabPanel';
import PageTitle from '../../PageTitle';
import PropertyForm from '../../../containers/Properties/PropertyFormContainer';

export default class PropertyCreator extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    geoState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    geoActions: PropTypes.object.isRequired,
    goTo: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { actions, geoActions, appState: { propertyProfile: property } } = this.props;
    geoActions.loadStateList();
    geoActions.loadCityList(property.state);
  }

  handleSavePropertyDetails = (values) => {
    const { actions, goTo } = this.props;
    actions.addPropertyDetails(values, (property) => {
      goTo(`/dashboard/properties/${property.id}`);
    });
  }

  render() {
    const { appState, geoState, actions, geoActions, propertyId, goTo } = this.props;

    return (
      <TabPanel title="Property Infomation">
        <PropertyForm appState={appState} geoState={geoState}
          savePropertyDetails={this.handleSavePropertyDetails}
          geoActions={geoActions}
          upload={actions.uploadPropertyPic} />
      </TabPanel>
    );
  }
}
