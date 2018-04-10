import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import SelectOptions from '../SelectOptions';
import { hasFieldError } from './helpers';

/*eslint-disable */
const renderSelect = field => // eslint-disable-line
  <SelectOptions
    name={field.input.name}
    disabled={field.input.disabled}
    loading={field.loading}
    loadingText={field.loadingText}
    onChange={function(event) {
      field.input.onChange(event);
      field.onValueChange && field.onValueChange(event.target.value);
    }}
    defaultValue={field.input.value || ''}
    optionList={field.optionList}
    defaultOption
    keyValue={field.keyValue || false}
    defaultOptionName={field.defaultOptionName}
  />;
/*eslint-disable */

const SelectInput = field =>
  field.inline
  ? <div className="form-horizontal">
    <BS.FormGroup validationState={hasFieldError(field) ? 'error' : null} className="row-narrow">
      <BS.Col sm={6} componentClass={BS.ControlLabel}>{field.label}</BS.Col>
      <BS.Col sm={6}>
        {renderSelect(field)}
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
    {renderSelect(field)}
    {hasFieldError(field) &&
     <BS.HelpBlock className="text-danger">{field.meta.error}</BS.HelpBlock>}
  </BS.FormGroup>;

export default SelectInput;

