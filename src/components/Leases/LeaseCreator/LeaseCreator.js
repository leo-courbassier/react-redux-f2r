import React, { Component, PropTypes } from 'react';
import Loader from '../../Loader';
import TabPanel from '../../TabPanel';
import PageTitle from '../../PageTitle';
import LeaseForm from '../../../containers/Leases/LeaseFormContainer';

export default class LeaseEditor extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    propertyActions: PropTypes.object.isRequired,
    goTo: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { propertyActions } = this.props;
    propertyActions.loadPropertiesList();
  }

  render() {
    const { appState, actions } = this.props;

    return (
      <TabPanel title="Lease Infomation">
        <LeaseForm appState={appState}
          saveLeaseDetails={actions.addLeaseDetails} />
      </TabPanel>
    );
  }
}
