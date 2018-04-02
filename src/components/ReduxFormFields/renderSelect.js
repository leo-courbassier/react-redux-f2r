import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import { hasFieldError } from './helpers';

const renderSelect = field =>
  <BS.FormGroup validationState={hasFieldError(field) ? 'error' : null}>
    {field.label && <BS.ControlLabel>{field.label}</BS.ControlLabel>}
    <BS.FormControl
      componentClass="select"
      placeholder={field.placeholder ? field.placeholder : ''}
      {...field.input}>
      {field.children}
    </BS.FormControl>
    {hasFieldError(field) &&
     <BS.HelpBlock className="text-danger">{field.meta.error}</BS.HelpBlock>}
  </BS.FormGroup>;

export default renderSelect;
