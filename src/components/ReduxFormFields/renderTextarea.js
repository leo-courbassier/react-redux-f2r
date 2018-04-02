import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import { hasFieldError } from './helpers';

const renderTextarea = field =>
  <BS.FormGroup validationState={hasFieldError(field) ? 'error' : null}>
    {field.label && <BS.ControlLabel>{field.label}</BS.ControlLabel>}
    <BS.FormControl
      componentClass="textarea"
      placeholder={field.placeholder ? field.placeholder : ''}
      rows={field.rows}
      {...field.input} />
    {hasFieldError(field) &&
     <BS.HelpBlock className="text-danger">{field.meta.error}</BS.HelpBlock>}
  </BS.FormGroup>;

export default renderTextarea;
