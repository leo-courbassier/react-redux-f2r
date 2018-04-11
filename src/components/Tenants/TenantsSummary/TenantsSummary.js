import React, { Component, PropTypes } from 'react';
import { Button, Label, Table, OverlayTrigger, Glyphicon, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

export default class TenantsSummary extends Component {
  static propTypes = {
    tenants: PropTypes.array,
    goTo: PropTypes.func.isRequired
  };

  handleAddNewTenant = () => {
    const { goTo } = this.props;
    goTo('/dashboard/tenants/new');
  }

  get maturityTooltip() {
    return (
      <Tooltip id="totalEarningsTooltip" className="f2rTooltip">
        <span>
          Progress towards completion of tenant
        </span>
      </Tooltip>
    );
  }

  getType(tenant) {
    return tenant.monthToMonth ? 'Month to Month' : 'Set Term';
  }

  renderTenantList(tenantList) {
    return _.map(tenantList, (tenant, index) => (
      <div className="text-center" key={index}>
        {`${tenant.firstName || ''} ${tenant.middleName || ''} ${tenant.lastName || ''}`}
      </div>
    ));
  }

  renderContent() {
    const { goTo, tenants } = this.props;
    return (
      _.map(tenants, (tenant, index) => (
        <tr key={index}>
          <td>
            <Link to={`/dashboard/properties/${tenant.propertyId}`}>
              {tenant.propertyName}
            </Link>
          </td>
          <td>{this.getType(tenant)}</td>
          <td>{this.renderTenantList(tenant.renterList)}</td>
          <td>{tenant.startDate}</td>
          <td>{tenant.endDate}</td>
          <td>{tenant.rentPaymentDate || 'N/A'}</td>
          <td>{tenant.maturity}</td>
          <td>{tenant.refundableAmount}</td>
          <td>{tenant.nonRefundableAmount}</td>
          <td>
            <Button block bsSize="small" bsStyle="success"
              onClick={function () { goTo(`/dashboard/tenants/${tenant.tenantId}`); }}>Contact Tenant</Button>
            <Button block bsSize="small" bsStyle="danger">End Tenant</Button>
          </td>
        </tr>
      ))
    );
  }

  renderEmptyContent() {
    return (
      <tr>
        <td colSpan={11}>No tenants found.</td>
      </tr>
    );
  }

  render() {
    const { tenants } = this.props;
    return (
      <div>
        <Table striped bordered condensed hover className="data-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Tenant</th>
              <th>F2R Score</th>
              <th>Start Date</th>
              <th>
                Made<br />
                <sub>Number/Amount</sub>
              </th>
              <th>
                Owed<br />
                <sub>Number/Amount</sub>
              </th>
              <th>
                Scheduled<br />
                <sub>Number/Amount</sub>
              </th>
              <th>Made</th>
              <th>Owed</th>
              <th>Received</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {tenants.length
              ? this.renderContent()
              : this.renderEmptyContent()
            }
          </tbody>
        </Table>
        <div className="text-right">
          <Button bsStyle="primary" onClick={this.handleAddNewTenant}>Create a New Tenant</Button>
        </div>
      </div>
    );
  }
}
