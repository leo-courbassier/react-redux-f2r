import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as leasesActions from '../../actions/leasesActions';
import { goTo } from '../../actions/routerActions';
import Loader from '../../components/Loader';
import LeasesSummary from '../../components/Leases/LeasesSummary';
import PageTitle from '../../components/PageTitle';

class LeasesSummaryContainer extends Component {
  componentWillMount() {
    this.props.actions.loadLeasesList();
  }
  render() {
    const { appState, actions, goTo } = this.props;

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="leasesList">
        <LeasesSummary
          appState={this.props.appState}
          leases={appState.leasesList}
          updateLeaseDetails={payload => { actions.updateLeaseDetails(payload, this.props.actions.loadLeasesList); }}
          goTo={goTo}
        />
      </Loader>
    );
  }
}

function mapStateToProps(state) {
  return {
    appState: state.leasesAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(leasesActions, dispatch),
    goTo: bindActionCreators(goTo, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeasesSummaryContainer);
