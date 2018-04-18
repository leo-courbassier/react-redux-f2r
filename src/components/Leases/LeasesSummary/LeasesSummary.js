import React, { Component, PropTypes } from 'react';
import { Button, DropdownButton, MenuItem, Label, Table, OverlayTrigger, Glyphicon, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

import ButtonSpinner from '../../ButtonSpinner';

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
    return lease.leaseId && (lease.monthToMonth ? 'Month to Month' : 'Set Term');
  }

  updateLeaseStatus(id, leaseStatus) {
    const payload = { id, leaseStatus };
    this.props.updateLeaseDetails(payload);
  }

  renderTenantList(tenantList) {
    return _.map(tenantList, (tenant, index) => (
      <div className="text-center" key={index}>
        {`${tenant.firstName || ''} ${tenant.middleName || ''} ${tenant.lastName || ''}`}
      </div>
    ));
  }

  renderContent() {
    const { appState, goTo, leases } = this.props;
    return (
      _.map(leases, (lease, index) => (
        <tr key={index}>
          <td>
            <Link to={`/dashboard/properties/${lease.propertyId}`}>
              {lease.propertyName || 'N/A'}
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
            {appState.status.saving['leaseDetails'] ? (
              <div className="lease-actions-loading">
                <ButtonSpinner />
              </div>
            ) : lease.leaseId && (
              <div className="lease-actions">
                <Button block bsSize="small" bsStyle="success"
                  onClick={function () { goTo(`/dashboard/leases/${lease.leaseId}`); }}>Edit Lease</Button>
                {lease.leaseStatus === 'ACTIVE' ? (
                  <Button
                    bsSize="small"
                    bsStyle="success"
                    onClick={this.updateLeaseStatus.bind(this, lease.leaseId, 'ACTIVE')}
                    block
                  >
                    Reopen Lease
                  </Button>
                ) : (
                  <DropdownButton
                    bsSize="small"
                    bsStyle="danger"
                    title="End Lease"
                    id="dropdown-end-lease"
                  >
                    <MenuItem onClick={this.updateLeaseStatus.bind(this, lease.leaseId, 'COMPLETE')} eventKey="1">Completed</MenuItem>
                    <MenuItem onClick={this.updateLeaseStatus.bind(this, lease.leaseId, 'EVICTED')} eventKey="2">Evicted</MenuItem>
                  </DropdownButton>
                )}
              </div>
            )}
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
