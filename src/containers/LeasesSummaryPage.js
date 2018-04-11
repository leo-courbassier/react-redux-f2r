import React, { Component, PropTypes } from 'react';

import PageTitle from '../components/PageTitle';
import LeasesSummaryContainer from './Leases/LeasesSummaryContainer';

export default class LeasesSummaryPage extends Component {
  render() {
    return (
      <div className="leasesSummary">
        <PageTitle>My Leases {'>'} Summary</PageTitle>

        <LeasesSummaryContainer />

      </div>
    );
  }
}
