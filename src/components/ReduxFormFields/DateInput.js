import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import { hasFieldError } from './helpers';
import SelectOptions from '../SelectOptions';

export default class DateInput extends Component {
  get months() {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
  }
  get days() {
    let days = [];
    for (let day = 1; day <= 31; day++) {
      day < 10 ? days.push('0'+day) : days.push(day);
    }
    return days;
  }

  get years() {
    let years = [];
    for (let year = new Date().getFullYear(); year >= 1900; year--) {
      years.push(year);
    }
    return years;
  }

  handleChangeYear = (event) => {
    const { input: { onChange } } = this.props;
    const prevValues = this.getValueArray();
    const value = event.target.value + '-' + prevValues[1] + '-' + prevValues[2];
    onChange(value);
  }
  handleChangeMonth = (event) => {
    const { input: { onChange } } = this.props;
    const prevValues = this.getValueArray();
    let month = parseInt(event.target.value, 10) + 1;
    if (parseInt(month, 10) < 10) month = '0' + month;
    const value = prevValues[0] + '-' + month + '-' + prevValues[2];
    onChange(value);
  }
  handleChangeDay = (event) => {
    const { input: { onChange } } = this.props;
    const prevValues = this.getValueArray();
    const value = prevValues[0] + '-' + prevValues[1] + '-' + event.target.value;
    onChange(value);
  }

  getValueArray() {
    const { input: { value } } = this.props;
    return value.split('-');
  }

  render() {
    const field = this.props;
    const value = this.getValueArray();

    return (
      <BS.FormGroup validationState={hasFieldError(field) ? 'error' : null}>
        <div className="date-of-birth">
          <div className="row">
            <div className="item">
              <BS.ControlLabel>Month</BS.ControlLabel>
              <SelectOptions
                onChange={this.handleChangeMonth}
                name="dobMonth"
                optionList={this.months}
                defaultOption="Month..."
                defaultOptionName="Month..."
                defaultValue={parseInt(value[1], 10) - 1}
                keyValue
                ref="dobMonth"
               />
            </div>
            <div className="item">
              <BS.ControlLabel>Day</BS.ControlLabel>
              <SelectOptions
                onChange={this.handleChangeDay}
                name="dobDay"
                optionList={this.days}
                defaultOption="Day..."
                defaultOptionName="Day..."
                defaultValue={value[2]}
                ref="dobDay"
               />
            </div>
            <div className="item">
              <BS.ControlLabel>Year</BS.ControlLabel>
              <SelectOptions
                onChange={this.handleChangeYear}
                name="dobYear"
                optionList={this.years}
                defaultOption="Year..."
                defaultOptionName="Year..."
                defaultValue={value[0]}
                ref="dobYear"
               />
            </div>
          </div>
        </div>
        {hasFieldError(field) && (
          <BS.HelpBlock className="text-danger">{field.meta.error}</BS.HelpBlock>
        )}
      </BS.FormGroup>
    );
  }
}
