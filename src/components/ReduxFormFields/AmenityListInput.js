import React, { Component, PropTypes } from 'react';
import { Col, Row, Checkbox } from 'react-bootstrap';
import _ from 'lodash';
import { hasFieldError } from './helpers';
import SelectOptions from '../SelectOptions';

export default class AmenityListInput extends Component {
  static propTypes = {
    input: PropTypes.object.isRequired
  };

  handleValueChange = (name, type, value) => {
    const { input: { value: amenityList, onChange } } = this.props;
    const newAmenityList = _.find(amenityList, { amenityName: name })
      ? _.differenceBy(amenityList, [{ amenityName: name }], 'amenityName')
      : _.unionBy(amenityList, [{
        amenityName: name,
        amenityType: type,
        installDate: "2013-04-15"
      }], 'amenityName');
    onChange(newAmenityList);
  }

  amenityItem(name, type) {
    const { input: { value: amenityList } } = this.props;
    const that = this;
    return (
      <Checkbox
        checked={typeof _.find(amenityList, { amenityName: name }) !== 'undefined'}
        onChange={function (e) { that.handleValueChange(name, type, e.target.value); }}
      >
        {name}
      </Checkbox>
    );
  }

  render() {
    const { input: { value: amenityList } } = this.props;
    return (
      <Row>
        <Col sm={4}>
          <div className="amenities-heading">
            Interior
          </div>
          <Row className="row-narrow">
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Central A/C', 'INTERIOR')}
            </Col>
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Central Heat', 'INTERIOR')}
            </Col>
          </Row>
          <Row className="row-narrow">
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Hot Water', 'INTERIOR')}
            </Col>
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Washer/Dryer', 'INTERIOR')}
            </Col>
          </Row>
        </Col>
        <Col sm={4}>
          <div className="amenities-heading">
            Kitchen
          </div>
          <Row className="row-narrow">
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Refrigerator', 'KITCHEN')}
            </Col>
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Dishwasher', 'KITCHEN')}
            </Col>
          </Row>
          <Row className="row-narrow">
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Oven Range', 'KITCHEN')}
            </Col>
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Microwave', 'KITCHEN')}
            </Col>
          </Row>
        </Col>
        <Col sm={4}>
          <div className="amenities-heading">
            Exterior
          </div>
          <Row className="row-narrow">
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Yard', 'EXTERIOR')}
            </Col>
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Deck', 'EXTERIOR')}
            </Col>
          </Row>
          <Row className="row-narrow">
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Patio', 'EXTERIOR')}
            </Col>
            <Col lg={6} md={12} sm={6}>
              {this.amenityItem('Fence', 'EXTERIOR')}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
