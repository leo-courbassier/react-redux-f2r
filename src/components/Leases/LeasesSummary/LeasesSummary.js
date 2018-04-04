import React, { Component, PropTypes } from 'react';
import { Button, Label, Table, OverlayTrigger, Glyphicon, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

export default class LeasesSummary extends Component {
  static propTypes = {
    leases: PropTypes.array,
    goTo: PropTypes.func.isRequired
  };

  handleAddNewLease = () => {
    const { goTo } = this.props;
    goTo('/dashboard/leases/new');
  }

  get maturityTooltip() {
    return (
      <Tooltip id="totalEarningsTooltip" className="f2rTooltip">
        <span>
          Progress towards completion of lease
        </span>
      </Tooltip>
    );
  }

  getType(lease) {
    return lease.monthToMonth ? 'Month to Month' : 'Set Term'
  }

  renderTenantList(tenantList) {
    return _.map(tenantList, tenant => (
      <div className="text-center">
        {`${tenant.firstName || ''} ${tenant.middleName || ''} ${tenant.lastName || ''}`}
      </div>
    ));
  }

  renderContent() {
    const { leases } = this.props;
    return (
      _.map(leases, (lease, index) => (
        <tr key={index}>
          <td>
            <Link to={`/dashboard/properties/${lease.propertyId}`}>
              {lease.propertyName}
            </Link>
          </td>
          <td>{this.getType(lease)}</td>
          <td>{this.renderTenantList(lease.tenantList)}</td>
          <td>{lease.startDate}</td>
          <td>{lease.endDate}</td>
          <td>{lease.rentPaymentDate || 'N/A'}</td>
          <td>{lease.maturity}</td>
          <td>{lease.refundableAmount}</td>
          <td>{lease.nonRefundableAmount}</td>
          <td>
            <Button block bsSize="small" bsStyle="success">Edit Lease</Button>
            <Button block bsSize="small" bsStyle="danger">End Lease</Button>
          </td>
        </tr>
      ))
    );
  }

  renderEmptyContent() {
    return (
      <tr>
        <td colSpan={10}>No leases found.</td>
      </tr>
    );
  }

  render() {
    const { leases } = this.props;
    return (
      <div>
        <Table striped bordered condensed hover className="data-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Tenant</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Pay Date</th>
              <th>
                Maturity
                <OverlayTrigger trigger={['focus', 'hover']} placement="bottom" overlay={this.maturityTooltip}>
                  <div className="top-right-corner">
                    <Glyphicon glyph="info-sign" />
                  </div>
                </OverlayTrigger>
              </th>
              <th>Refundable</th>
              <th>Non-Refundable</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {leases.length
              ? this.renderContent()
              : this.renderEmptyContent()
            }
          </tbody>
        </Table>
        <div className="text-right">
          <Button bsStyle="primary" onClick={this.handleAddNewLease}>Create a New Lease</Button>
        </div>
      </div>
    );
  }
}
