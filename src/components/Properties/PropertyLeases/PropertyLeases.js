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
          <td>
            {lease.rent}
          </td>
          <td>{lease.startDate}</td>
          <td>{lease.endDate}</td>
          <td>{lease.rentPaymentDate}</td>
          <td>{this.renderDividedColumn(lease.refundableAmount, lease.nonRefundableAmount)}</td>
        </tr>
      ))
    );
  }

  renderEmptyContent() {
    return (
      <tr>
        <td colSpan={5}>No lease information found.</td>
      </tr>
    );
  }

  render(){
    const { propertyLeases } = this.props;
    return (
      <div>
        <Table striped bordered condensed hover className="properties-list-table">
          <thead>
            <tr>
              <th>Rent</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Pay Date</th>
              <th>Deposits<br /><sub>(Refundable / Non-Refundable)</sub></th>
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
