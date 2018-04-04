import React, { Component, PropTypes } from 'react';
import { Button, Label, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

export default class PropertyTenants extends Component {
  static propTypes = {
    propertyTenants: PropTypes.array,
    goTo: PropTypes.func.isRequired
  };

  handleGotoMyLeases = () => {
    const { goTo } = this.props;
    goTo('/dashboard/tenants');
  }

  renderContent() {
    const { propertyTenants } = this.props;
    return (
      _.map(propertyTenants, (tenant, index) => (
        <tr key={index}>
          <td>{tenant.leaseId}</td>
          <td>
            {tenant.firstName} {tenant.middleName} {tenant.lastName}
          </td>
          <td>{tenant.email}</td>
          <td>{tenant.userDetails.phoneNumber || 'N/A'}</td>
          <td>{tenant.madePayments || 'N/A'}</td>
          <td>{tenant.totalPayment || 'N/A'}</td>
        </tr>
      ))
    );
  }

  renderEmptyContent() {
    return (
      <tr>
        <td colSpan={5}>No tenants information found.</td>
      </tr>
    );
  }

  render(){
    const { propertyTenants } = this.props;
    return (
      <div>
        <Table striped bordered condensed hover className="properties-list-table text-center">
          <thead>
            <tr>
              <th className="text-center">Lease ID</th>
              <th className="text-center">Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Phone</th>
              <th className="text-center">Payments Made</th>
              <th className="text-center">Total Payments</th>
            </tr>
          </thead>
          <tbody>
            {propertyTenants.length
              ? this.renderContent()
              : this.renderEmptyContent()
            }
          </tbody>
        </Table>
        <div className="text-right">
          <Button bsStyle="primary" onClick={this.handleGotoMyLeases}>Go to My Tenants</Button>
        </div>
      </div>
    );
  }
}
