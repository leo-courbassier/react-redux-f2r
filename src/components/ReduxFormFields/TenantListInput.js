import React, { Component, PropTypes } from 'react';
import { Button, Col, Row, ControlLabel, FormControl, FormGroup, Glyphicon, InputGroup } from 'react-bootstrap';
import _ from 'lodash';
import { hasFieldError } from './helpers';
import SelectOptions from '../SelectOptions';

export default class TenantListInput extends Component {
  static propTypes = {
    input: PropTypes.object.isRequired
  };

  constructor(props) {
    const { input: { value: renterList } } = props;
    super(props);
    this.state = { renterList };
  }

  componentWillReceiveProps(nextProps) {
    const { input: { value: renterList } } = nextProps;
    this.setState({ renterList });
  }

  handleAddAnother = () => {
    const { renterList } = this.state;
    const { input: { onChange } } = this.props;
    const newRenterList = _.concat(renterList, [{ userDetails: {} }]);
    this.setState({ renterList: newRenterList }, () => {
      onChange(newRenterList);
    });
  }

  handleValueChange = (index, name, value) => {
    const { input: { onChange } } = this.props;
    const { renterList } = this.state;
    const newRenterList = renterList.slice();
    newRenterList[index][name] = value;
    this.setState({ renterList: newRenterList }, () => {
      onChange(newRenterList);
    });
  }

  renterItem = (item, index) => {
    const that = this;
    const warn = <span className="text-danger"> *</span>;

    return (
      <div key={index}>
        {index > 0 &&
          <div className="section">Additional Tenants {warn}</div>}
        <Row>
          <Col sm={6}>
            <FormGroup className="row-narrow">
              <Col componentClass={ControlLabel} sm={6}>
                First Name
              </Col>
              <Col sm={6}>
                <FormControl
                  value={item.firstName}
                  name="firstName"
                  onChange={function(e) { that.handleValueChange(index, e.target.name, e.target.value); }}
                  placeholder="First Name"
                  type="text" />
              </Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup className="row-narrow">
              <Col componentClass={ControlLabel} sm={6}>
                Last Name
              </Col>
              <Col sm={6}>
                <FormControl
                  value={item.lastName}
                  name="lastName"
                  onChange={function(e) { that.handleValueChange(index, e.target.name, e.target.value); }}
                  placeholder="Last Name"
                  type="text" />
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup className="row-narrow">
              <Col componentClass={ControlLabel} md={6}>
                Email
              </Col>
              <Col md={6}>
                <FormControl
                  value={item.email}
                  name="email"
                  onChange={function(e) { that.handleValueChange(index, e.target.name, e.target.value); }}
                  placeholder="example@email.com"
                  type="email" />
              </Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup className="row-narrow">
              <Col componentClass={ControlLabel} sm={6}>
                Phone
              </Col>
              <Col sm={6}>
                <FormControl
                  value={item.phoneNumber}
                  name="phoneNumber"
                  onChange={function(e) { that.handleValueChange(index, e.target.name, e.target.value); }}
                  placeholder="xxx-xxx-xxxx"
                  type="text" />
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { input: { value: renterList } } = this.props;
    return (
      <div className="form-horizontal">
        {_.map(renterList, this.renterItem)}
        <div className="anotherRenterSection text-center">
          <Button
            onClick={this.handleAddAnother}
            bsStyle="success">
            Add Another paying tenant to this lease
          </Button>
        </div>
      </div>
    );
  }
}
