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
    const { actions, propertyActions, leaseId } = this.props;
    actions.loadLeaseDetails(leaseId);
    propertyActions.loadPropertiesList();
  }

  render() {
    const { appState, actions, leaseId } = this.props;

    return (
      <TabPanel title="Lease Infomation">
        <Loader appState={this.props.appState} statusType="loading" statusAction="leaseDetails">
          <LeaseForm appState={appState}
            leaseId={parseInt(leaseId, 10)}
            saveLeaseDetails={actions.updateLeaseDetails} />
        </Loader>
      </TabPanel>
    );
  }
}
