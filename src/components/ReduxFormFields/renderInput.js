import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import { hasFieldError } from './helpers';

const renderInput = field =>
  <BS.FormGroup validationState={hasFieldError(field) ? 'error' : null}>
    {field.label && <BS.ControlLabel>{field.label}</BS.ControlLabel>}
    <BS.FormControl
      type={field.type}
      placeholder={field.placeholder ? field.placeholder : ''}
      {...field.input} />
    {hasFieldError(field) &&
     <BS.HelpBlock className="text-danger">{field.meta.error}</BS.HelpBlock>}
  </BS.FormGroup>;

export default renderInput;
