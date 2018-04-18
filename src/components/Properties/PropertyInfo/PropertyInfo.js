import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Button, Grid, Col, Row, Image } from 'react-bootstrap';
import { FaSquareO, FaCheckSquareO } from 'react-icons/lib/fa';
import _ from 'lodash';
import { getLastPropertyImageURL } from '../../../utils/property';

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

  amenityItem(name) {
    const { property: { amenityList } } = this.props;
    return amenityList && (
      <div className="amenity-item">
        {name}
        <span className="pull-right">
          {
            _.find(amenityList, { amenityName: name })
            ? <FaCheckSquareO />
            : <FaSquareO />
          }
        </span>
      </div>
    );
  }

  render(){
    const { property, params } = this.props;
    const imageURL = getLastPropertyImageURL(property);
    return (
      <Grid fluid>
        <Row>
          <Col sm={4}>
            <dl className="dl-property">
              <dt>Title</dt>
              <dd>{property.headline}</dd>
              <dt>Address</dt>
              <dd>{this.getAddress(property)}</dd>
            </dl>
          </Col>
          <Col sm={4} />
          <Col sm={4}>
            {imageURL && (
              <div className='property-image'>
                <Image src={imageURL} />
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <dl className="dl-property">
              <dt>Description</dt>
              <dd>{property.description || 'N/A'}</dd>
              <dt>Details</dt>
              <dd>
                <Row>
                  <Col sm={3}>
                    <label>Property Type</label>
                    <div>{property.propertyType}</div>
                  </Col>
                  <Col sm={3}>
                    <label>Space (sq ft)</label>
                    <div>{property.sqft}</div>
                  </Col>
                  <Col sm={3}>
                    <label>Beds</label>
                    <div>{property.numBeds}</div>
                  </Col>
                  <Col sm={3}>
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
              <dt>Amenities</dt>
              <Row>
                <Col sm={4}>
                  <div className="amenities-heading">
                    Interior
                  </div>
                  <Row className="row-narrow">
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Central A/C')}
                    </Col>
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Central Heat')}
                    </Col>
                  </Row>
                  <Row className="row-narrow">
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Hot Water')}
                    </Col>
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Washer/Dryer')}
                    </Col>
                  </Row>
                </Col>
                <Col sm={4}>
                  <div className="amenities-heading">
                    Kitchen
                  </div>
                  <Row className="row-narrow">
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Refrigerator')}
                    </Col>
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Dishwasher')}
                    </Col>
                  </Row>
                  <Row className="row-narrow">
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Oven Range')}
                    </Col>
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Microwave')}
                    </Col>
                  </Row>
                </Col>
                <Col sm={4}>
                  <div className="amenities-heading">
                    Exterior
                  </div>
                  <Row className="row-narrow">
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Yard')}
                    </Col>
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Deck')}
                    </Col>
                  </Row>
                  <Row className="row-narrow">
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Patio')}
                    </Col>
                    <Col lg={6} md={12} sm={6}>
                      {this.amenityItem('Fence')}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </dl>
          </Col>
        </Row>
      </Grid>
    );
  }
}
