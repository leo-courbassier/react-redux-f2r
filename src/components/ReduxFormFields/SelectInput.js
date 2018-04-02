import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import SelectOptions from '../SelectOptions';
import { hasFieldError } from './helpers';

const SelectInput = field =>
  <BS.FormGroup validationState={hasFieldError(field) ? 'error' : null}>
    {field.label && <BS.ControlLabel>{field.label}</BS.ControlLabel>}
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
      defaultOptionName={field.defaultOptionName}
    />
    {hasFieldError(field) &&
     <BS.HelpBlock className="text-danger">{field.meta.error}</BS.HelpBlock>}
  </BS.FormGroup>;

export default SelectInput;

