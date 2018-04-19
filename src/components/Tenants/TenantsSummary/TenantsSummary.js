import React, { Component, PropTypes } from 'react';
import { Button, Label, Table, OverlayTrigger, Glyphicon, Popover, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

export default class TenantsSummary extends Component {
  static propTypes = {
    tenants: PropTypes.array,
    goTo: PropTypes.func.isRequired
  };

  handleGoToLeases = () => {
    const { goTo } = this.props;
    goTo('/dashboard/leases');
  }

  getProfilePicturePopover(item) {
    const id = `${item.id}-${item.firstName}-${item.lastName}`;
    return (
      <Popover id={id}>
        <span className="tenantProfileImage">
          {item.profilePicURL
            ? <img src={item.profilePicURL} alt="" />
            : 'No Profile Image'
          }
        </span>
      </Popover>
    );
  }

  getType(tenant) {
    return tenant.monthToMonth ? 'Month to Month' : 'Set Term';
  }

  renderTenantName(item) {
    return (
      <OverlayTrigger trigger={['focus', 'hover']} placement="bottom" overlay={this.getProfilePicturePopover(item)}>
        <span>
          {`${item.firstName || ''} ${item.middleName || ''} ${item.lastName || ''}`}
        </span>
      </OverlayTrigger>
    );
  }

  renderF2RScore(item) {
    return item.f2rScore || 'N/A';
  }

  renderMadePayments(tenant, id) {
    return tenant.madePayments[id]
      ? `${tenant.madePayments[id].count} / $${tenant.madePayments[id].amount}`
      : 'N/A';
  }

  renderOwedPayments(tenant, id) {
    return tenant.owedPayments[id]
      ? `${tenant.owedPayments[id].count} / $${tenant.owedPayments[id].amount}`
      : 'N/A';
  }

  renderScheduledPayments(tenant, id) {
    return tenant.scheduledPayments[id]
      ? `${tenant.scheduledPayments[id].count} / $${tenant.scheduledPayments[id].amount}`
      : 'N/A';
  }

  renderContent() {
    const { goTo, tenants } = this.props;
    return (
      _.map(tenants, (tenant, index) => (
        <tbody>
          {tenant.tenantList && tenant.tenantList.length
            ? _.map(tenant.tenantList, (item, subIndex) => (
              <tr key={`${index}-${subIndex}`}>
                {subIndex === 0 &&
                  <td className="tenantPropertyName" rowSpan={tenant.tenantList.length}>
                    <Link to={`/dashboard/properties/${tenant.propertyId}`}>
                      {tenant.propertyName || 'N/A'}
                    </Link>
                  </td>
                }
                <td className="tenantsName">{this.renderTenantName(item)}</td>
                <td className="tenantsF2rScore">{this.renderF2RScore(item)}</td>
                <td className="tenantsMadePayments">{this.renderMadePayments(tenant, item.id)}</td>
                <td className="tenantsOwedPayments">{this.renderOwedPayments(tenant, item.id)}</td>
                <td className="tenantsScheduledPayments">{this.renderScheduledPayments(tenant, item.id)}</td>
                {subIndex === 0 &&
                  <td className="tenantsMade" rowSpan={tenant.tenantList.length}>
                    {Object.keys(tenant.madePayments).length}
                  </td>
                }
                {subIndex === 0 &&
                  <td className="tenantsOwed" rowSpan={tenant.tenantList.length}>
                    {Object.keys(tenant.owedPayments).length}
                  </td>
                }
                {subIndex === 0 &&
                  <td className="tenantReceived" rowSpan={tenant.tenantList.length}>
                    {Object.keys(tenant.scheduledPayments).length}
                  </td>
                }
                <td className="tenantAction">
                  <Button block bsSize="small" bsStyle="success"
                    onClick={function () { goTo(`/dashboard/tenants/${tenant.tenantId}`); }}>
                    Contact Tenant
                  </Button>
                </td>
              </tr>
            ))
            : (
              <tr key={index}>
                <td className="tenantPropertyName">
                  <Link to={`/dashboard/properties/${tenant.propertyId}`}>
                    {tenant.propertyName || 'N/A'}
                  </Link>
                </td>
                <td className="tenantsName">N/A</td>
                <td className="tenantsF2rScore">N/A</td>
                <td className="tenantsMadePayments">N/A</td>
                <td className="tenantsOwedPayments">N/A</td>
                <td className="tenantsScheduledPayments">N/A</td>
                <td className="tenantsMade">N/A</td>
                <td className="tenantsOwed">N/A</td>
                <td className="tenantReceived">N/A</td>
                <td className="tenantAction">
                  <Button block bsSize="small" bsStyle="success"
                    onClick={function () { goTo(`/dashboard/tenants/${tenant.tenantId}`); }}>
                    Contact Tenant
                  </Button>
                </td>
              </tr>
            )
          }
        </tbody>
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
        <Table condensed hover className="tenant-summary-table">
          <thead>
            <tr>
              <th className="tenantPropertyName">Property</th>
              <th className="tenantsName">Tenant</th>
              <th className="tenantsF2rScore">F2R Score</th>
              <th className="tenantsMadePayments">
                Made<br />
                <sub>Number/Amount</sub>
              </th>
              <th className="tenantsOwedPayments">
                Owed<br />
                <sub>Number/Amount</sub>
              </th>
              <th className="tenantsScheduledPayments">
                Scheduled<br />
                <sub>Number/Amount</sub>
              </th>
              <th className="tenantsMade">Made</th>
              <th className="tenantsOwed">Owed</th>
              <th className="tenantReceived">Received</th>
              <th className="tenantAction" />
            </tr>
          </thead>
          {tenants.length
            ? this.renderContent()
            : this.renderEmptyContent()
          }
        </Table>
        <div className="text-right">
          <Button bsStyle="primary" onClick={this.handleGoToLeases}>Go to My Leases to Add New Tenants</Button>
        </div>
      </div>
    );
  }
}
