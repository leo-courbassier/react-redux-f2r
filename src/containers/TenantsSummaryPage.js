import React, { Component, PropTypes } from 'react';

import PageTitle from '../components/PageTitle';
import TenantsSummaryContainer from './Tenants/TenantsSummaryContainer';

export default class TenantsSummaryPage extends Component {
  render() {
    return (
      <div className="tenantsSummary">
        <PageTitle>My Tenants {'>'} Summary</PageTitle>

        <TenantsSummaryContainer />

      </div>
    );
  }
}
