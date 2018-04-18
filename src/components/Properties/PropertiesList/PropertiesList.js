import React, { Component, PropTypes } from 'react';
import { Button, Label, Table, OverlayTrigger, Glyphicon, Tooltip } from 'react-bootstrap';
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

  get totalEarningsTooltip() {
    return (
      <Tooltip id="totalEarningsTooltip" className="f2rTooltip">
        <span>
          Total lifetime rent collected on the property
        </span>
      </Tooltip>
    );
  }

  get occupancyRateTooltip() {
    return (
      <Tooltip id="occupancyRateTooltip" className="f2rTooltip">
        <span>
          Percentage of total time your property has been occupied
        </span>
      </Tooltip>
    );
  }

  get averageYieldTooltip() {
    return (
      <Tooltip id="averageYieldTooltip" className="f2rTooltip">
        <span>
          The average monthly return generated by a property
        </span>
      </Tooltip>
    );
  }

  renderStatus(status) {
    const style = (status === 'VACANT') ? 'danger' : 'success';
    return <Label bsStyle={style}>{status}</Label>;
  }

  renderDividedColumn(text1, text2) {
    return (text1 !== null || text2 !== null) && (
      <span className="divide-column">
        <span className="half-col">{text1}</span>
        <span className="half-col">{text2}</span>
      </span>
    );
  }

  renderContent() {
    const { properties } = this.props;
    return (
      _.map(properties, (property, index) => (
        <tr key={index}>
          <td>
            <Link to={`/dashboard/properties/${property.propertyId}`}>
              {property.propertyName || 'N/A'}
            </Link>
          </td>
          <td>{this.getAddress(property)}</td>
          <td>{this.renderStatus(property.status)}</td>
          <td>{property.rent}</td>
          <td>{this.renderDividedColumn(property.monthOccupied, property.rentCollected)}</td>
          <td>{this.renderDividedColumn(property.monthsLeft, property.rentRemaining)}</td>
          <td>{property.totalEarnings}</td>
          <td>{property.occupancyRate}</td>
          <td>{property.averageYield}</td>
          <td>
            <Button block bsSize="small" bsStyle="success">Search for Tenants</Button>
            <Button block bsSize="small" bsStyle="warning">Search for Agents</Button>
          </td>
        </tr>
      ))
    );
  }

  renderEmptyContent() {
    return (
      <tr>
        <td colSpan={10}>No properties found.</td>
      </tr>
    );
  }

  render(){
    const { properties } = this.props;
    return (
      <div>
        <Table striped bordered condensed hover className="data-table">
          <thead>
            <tr>
              <th width="10%">Property</th>
              <th>Address</th>
              <th>Status</th>
              <th>Rent<br /><sub>(per month)</sub></th>
              <th>{this.renderDividedColumn('Months Occupied', 'Rent Collected')}</th>
              <th>{this.renderDividedColumn('Months Remaining', 'Rent Balance')}</th>
              <th>
                Total Earnings<br /><sub>(total rent)</sub>
                <OverlayTrigger trigger={['focus', 'hover']} placement="bottom" overlay={this.totalEarningsTooltip}>
                  <div className="top-right-corner">
                    <Glyphicon glyph="info-sign" />
                  </div>
                </OverlayTrigger>
              </th>
              <th>
                Occupancy Rate
                <OverlayTrigger trigger={['focus', 'hover']} placement="bottom" overlay={this.occupancyRateTooltip}>
                  <div className="top-right-corner">
                    <Glyphicon glyph="info-sign" />
                  </div>
                </OverlayTrigger>
              </th>
              <th>
                Average Yield
                <OverlayTrigger trigger={['focus', 'hover']} placement="bottom" overlay={this.averageYieldTooltip}>
                  <div className="top-right-corner">
                    <Glyphicon glyph="info-sign" />
                  </div>
                </OverlayTrigger>
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {properties.length
              ? this.renderContent()
              : this.renderEmptyContent()
            }
          </tbody>
        </Table>
        <div className="text-right">
          <Button bsStyle="primary" onClick={this.handleAddNewProperty}>Add New Property</Button>
        </div>
      </div>
    );
  }
}
