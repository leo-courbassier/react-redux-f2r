import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as tenantsActions from '../../actions/tenantsActions';
import { goTo } from '../../actions/routerActions';
import Loader from '../../components/Loader';
import TenantsSummary from '../../components/Tenants/TenantsSummary';
import PageTitle from '../../components/PageTitle';

class TenantsSummaryContainer extends Component {
  componentWillMount() {
    this.props.actions.loadTenantsList();
  }
  render() {
    const { appState, actions, goTo } = this.props;

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="tenantsList">
        <TenantsSummary tenants={appState.tenantsList} goTo={goTo} />
      </Loader>
    );
  }
}

function mapStateToProps(state) {
  return {
    appState: state.tenantsAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(tenantsActions, dispatch),
    goTo: bindActionCreators(goTo, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TenantsSummaryContainer);
