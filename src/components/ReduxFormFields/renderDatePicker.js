import React from 'react';
import Datetime from 'react-datetime';
import * as BS from 'react-bootstrap';
import { hasFieldError } from './helpers';

const handleValueChange = (field, m) => field.input.onChange(m.format ? m.format('YYYY-MM-DD') : m);
const renderDatePicker = field =>
  field.inline
  ? <div className="form-horizontal">
    <BS.FormGroup validationState={hasFieldError(field) ? 'error' : null} className="row-narrow">
      <BS.Col sm={6} componentClass={BS.ControlLabel}>{field.label}</BS.Col>
      <BS.Col sm={6}>
        <Datetime
          dateFormat="YYYY-MM-DD"
          timeFormat={false}
          inputProps={{
            name: field.input.name,
            placeholder: 'YYYY-MM-DD'
          }}
          viewMode="years"
          closeOnSelect
          {...field.input}
          onFocus={function () {}}
          onBlur={function () {}}
          onChange={function (m) { handleValueChange(field, m); }}
        />
      </BS.Col>
      {hasFieldError(field) &&
        <BS.Col xs={12}>
          <BS.HelpBlock className="text-danger">{field.meta.error}</BS.HelpBlock>
        </BS.Col>
      }
    </BS.FormGroup>
  </div>
  : <BS.FormGroup validationState={hasFieldError(field) ? 'error' : null}>
    {field.label && <BS.ControlLabel>{field.label}</BS.ControlLabel>}
    <Datetime
      dateFormat="YYYY-MM-DD"
      timeFormat={false}
      inputProps={{placeholder: 'YYYY-MM-DD'}}
      viewMode="years"
      closeOnSelect
      {...field.input}
      onFocus={function () {}}
      onBlur={function () {}}
      onChange={function (m) { handleValueChange(field, m); }}
    />
    {hasFieldError(field) &&
      <BS.HelpBlock className="text-danger">{field.meta.error}</BS.HelpBlock>}
  </BS.FormGroup>;

export default renderDatePicker;
