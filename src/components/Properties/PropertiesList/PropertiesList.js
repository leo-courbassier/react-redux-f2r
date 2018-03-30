import React, { Component, PropTypes } from 'react';
import { Button, Label, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

export default class PropertiesList extends Component {
  static propTypes = {
    properties: PropTypes.array,
    goTo: PropTypes.func.isRequired
  };

  handleAddNewProperty = () => {
    const { goTo } = this.props;
    goTo('/dashboard/properties/new');
  }

  getAddress(property) {
    return _.join([
      property.address1,
      property.address2,
      property.city,
      property.state,
      property.zipCode
    ], ', ');
  }

  renderStatus(status) {
    const style = (status === 'VACANT') ? 'danger' : 'success';
    return <Label bsStyle={style}>{status}</Label>;
  }

  renderDividedColumn(text1, text2) {
    return (
      <span className="divide-column">
        <span className="half-col">{text1}</span>
        <span className="half-col">{text2}</span>
      </span>
    );
  }

  render(){
    const { properties } = this.props;
    return (
      <div>
        <Table striped bordered condensed hover className="properties-list-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Address</th>
              <th>Status</th>
              <th>Rent<br /><sub>(per month)</sub></th>
              <th>{this.renderDividedColumn('Months Occupied', 'Rent Collected')}</th>
              <th>{this.renderDividedColumn('Months Remaining', 'Rent Balance')}</th>
              <th>Total Earnings<br /><sub>(total rent)</sub></th>
              <th>Occupancy Rate</th>
              <th>Average Yield</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {
              _.map(properties, (property, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/dashboard/properties/${property.propertyId}`}>
                      {property.propertyName}
                    </Link>
                  </td>
                  <td>{this.getAddress(property)}</td>
                  <td>{this.renderStatus(property.propertyStatus)}</td>
                  <td>{property.rent}</td>
                  <td>{property.monthOccupied} / {property.rentCollected}</td>
                  <td>{property.rentRemaining}</td>
                  <td>{property.totalEarnings}</td>
                  <td>{property.occupancyRate}</td>
                  <td>{property.averageYield}</td>
                  <td>
                    <Button block bsSize="small" bsStyle="success">Search for Tenants</Button>
                    <Button block bsSize="small" bsStyle="warning">Search for Agents</Button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        <div className="text-right">
          <Button onClick={this.handleAddNewProperty}>Add New Property</Button>
        </div>
      </div>
    );
  }
}
