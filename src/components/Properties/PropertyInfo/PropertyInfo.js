import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Button, Grid, Col, Row } from 'react-bootstrap';
import _ from 'lodash';

export default class PropertyInfo extends Component {
  static propTypes = {
    property: PropTypes.object
  };

  getAddress(property) {
    return _.join([
      property.address,
      property.secondLineAddress,
      property.city,
      property.state,
      property.zipCode
    ], ', ');
  }

  render(){
    const { property, params } = this.props;
    return (
      <Grid fluid>
        <Row>
          <Col xs={4}>
            <dl className="dl-property">
              <dt>Title</dt>
              <dd>{property.headline}</dd>
              <dt>Address</dt>
              <dd>{this.getAddress(property)}</dd>
            </dl>
          </Col>
          <Col xs={4} />
          <Col xs={4}>
            xx
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <dl className="dl-property">
              <dt>Description</dt>
              <dd>{property.description || 'Not Available'}</dd>
              <dt>Details</dt>
              <dd>
                <Row>
                  <Col xs={3}>
                    <label>Property Type</label>
                    <div>{property.propertyType}</div>
                  </Col>
                  <Col xs={3}>
                    <label>Space (sq ft)</label>
                    <div>{property.sqft}</div>
                  </Col>
                  <Col xs={3}>
                    <label>Beds</label>
                    <div>{property.numBeds}</div>
                  </Col>
                  <Col xs={3}>
                    <label>Baths</label>
                    <div>{property.numBaths}</div>
                  </Col>
                </Row>
              </dd>
            </dl>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <dl className="dl-property">
              <dt>Amenities </dt>
              <Row>
                <Col xs={4}>
                  <div className="amenities-heading">
                    Interior
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="text-center">
                    Kitchen
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="text-center">
                    Exterior
                  </div>
                </Col>
              </Row>
            </dl>
          </Col>
        </Row>
      </Grid>
    );
  }
}
