import React, { Component, PropTypes } from 'react';
import { Button, Label, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

export default class PropertyLeases extends Component {
  static propTypes = {
    propertyLeases: PropTypes.array,
    goTo: PropTypes.func.isRequired
  };

  handleGotoMyLeases = () => {
    const { goTo } = this.props;
    goTo('/dashboard/leases');
  }

  getSumDeposits(lease, depositStatus) {
    return _.reduce(
      _.filter(lease.depositList, { depositStatus }),
      (sum, item) => (sum + item.depositAmount),
      0
    );
  }

  renderDividedColumn(text1, text2) {
    return (
      <span className="divide-column">
        <span className="half-col">{text1}</span>
        <span className="half-col">{text2}</span>
      </span>
    );
  }

  renderContent() {
    const { propertyLeases } = this.props;
    return (
      _.map(propertyLeases, (lease, index) => (
        <tr key={index}>
          <td>{lease.id}</td>
          <td>{lease.rentAmount}</td>
          <td>{lease.startDate || 'N/A'}</td>
          <td>{lease.endDate || 'N/A'}</td>
          <td>{lease.rentDueDate || 'N/A'}</td>
          <td>
            {this.renderDividedColumn(
              this.getSumDeposits(lease, 'REFUNDABLE'),
              this.getSumDeposits(lease, 'NONREFUNDABLE')
            )}
          </td>
        </tr>
      ))
    );
  }

  renderEmptyContent() {
    return (
      <tr>
        <td colSpan={6}>No lease information found.</td>
      </tr>
    );
  }

  render(){
    const { propertyLeases } = this.props;
    return (
      <div>
        <Table striped bordered condensed hover className="properties-list-table text-center">
          <thead>
            <tr>
              <th className="text-center">Lease ID</th>
              <th className="text-center">Rent</th>
              <th className="text-center">Start Date</th>
              <th className="text-center">End Date</th>
              <th className="text-center">Pay Date</th>
              <th className="text-center">Deposits<br /><sub>(Refundable / Non-Refundable)</sub></th>
            </tr>
          </thead>
          <tbody>
            {propertyLeases.length
              ? this.renderContent()
              : this.renderEmptyContent()
            }
          </tbody>
        </Table>
        <div className="text-right">
          <Button bsStyle="primary" onClick={this.handleGotoMyLeases}>Go to My Leases</Button>
        </div>
      </div>
    );
  }
}
