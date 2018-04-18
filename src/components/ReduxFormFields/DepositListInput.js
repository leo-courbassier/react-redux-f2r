import React, { Component, PropTypes } from 'react';
import { Button, Col, Row, ControlLabel, FormControl, FormGroup, Glyphicon, InputGroup } from 'react-bootstrap';
import Datetime from 'react-datetime';
import _ from 'lodash';
import { hasFieldError } from './helpers';
import SelectOptions from '../SelectOptions';

export default class DepositListInput extends Component {
  static propTypes = {
    input: PropTypes.object.isRequired
  };

  constructor(props) {
    const { input: { value: depositList } } = props;
    super(props);
    this.state = { depositList };
  }

  componentWillReceiveProps(nextProps) {
    const { input: { value: depositList } } = nextProps;
    this.setState({ depositList });
  }

  handleAddAnother = () => {
    const { depositList } = this.state;
    const { input: { onChange } } = this.props;
    const newDepositList = _.concat(depositList, [{
      depositAmount: 550,
      depositType: 'SECURITY',
      depositStatus: 'REFUNDABLE'
    }]);
    this.setState({ depositList: newDepositList }, () => {
      onChange(newDepositList);
    });
  }

  handleValueChange = (index, name, value) => {
    const { input: { onChange } } = this.props;
    const { depositList } = this.state;
    const newDepositList = depositList.slice();
    newDepositList[index][name] = value;
    this.setState({ depositList: newDepositList }, () => {
      onChange(newDepositList);
    });
  }

  depositItem = (item, index) => {
    const that = this;

    const refundableStatus = (
      <FormControl componentClass="select" name="depositStatus" value={item.depositStatus}
        onChange={function(e) { that.handleValueChange(index, e.target.name, e.target.value); }}>
        <option value="">Select..</option>
        <option value="REFUNDABLE">Refundable</option>
        <option value="NONREFUNDABLE">Non-Refundable</option>
      </FormControl>
    );

    const depositTypeList = (
      <FormControl componentClass="select" value={item.depositType} name="depositType"
        onChange={function(e) { that.handleValueChange(index, e.target.name, e.target.value); }}>
        <option value="">Select..</option>
        <option value="SECURITY">Security</option>
        <option value="PET">Pet</option>
      </FormControl>
    );

    const warn = <span className="text-danger"> *</span>;

    return (
      <div key={index}>
        {index === 0
          ? <div className="section">Deposit Details {warn}</div>
          : <div className="section">Additional Deposit {warn}</div>}
        <Row>
          <Col sm={6}>
            <FormGroup className="row-narrow">
              <Col componentClass={ControlLabel} sm={6}>
                Deposit Type
              </Col>
              <Col sm={6}>
                {depositTypeList}
              </Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup className="row-narrow">
              <Col componentClass={ControlLabel} sm={6}>
                Deposit Amount
              </Col>
              <Col sm={6}>
                <FormControl
                  value={item.depositAmount}
                  name="depositAmount"
                  onChange={function(e) { that.handleValueChange(index, e.target.name, e.target.value); }}
                  placeholder="$$$$"
                  type="text" />
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup className="row-narrow">
              <Col componentClass={ControlLabel} md={6}>
                Deposit Due On
              </Col>
              <Col md={6}>
                <Datetime
                  dateFormat="YYYY-MM-DD"
                  timeFormat={false}
                  inputProps={{
                    name: 'dueDate',
                    placeholder: 'YYYY-MM-DD'
                  }}
                  viewMode="years"
                  closeOnSelect
                  value={item.dueDate}
                  onChange={function(m) { that.handleValueChange(index, 'dueDate', m.format ? m.format('YYYY-MM-DD') : m); }}
                />
              </Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup className="row-narrow">
              <Col componentClass={ControlLabel} sm={6}>
                Refundable Status
              </Col>
              <Col sm={6}>
                {refundableStatus}
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { input: { value: depositList } } = this.props;
    return (
      <div className="form-horizontal">
        {_.map(depositList, this.depositItem)}
        <div className="anotherDepositSection text-center">
          <Button
            onClick={this.handleAddAnother}
            bsStyle="success">
            Add Another Deposit
          </Button>
        </div>
      </div>
    );
  }
}
