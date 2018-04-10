import React from 'react';
import * as BS from 'react-bootstrap';
import { hasFieldError } from './helpers';

const renderInput = field =>
  field.inline
  ? <div className="form-horizontal">
    <BS.FormGroup validationState={hasFieldError(field) ? 'error' : null} className="row-narrow">
      <BS.Col sm={6} componentClass={BS.ControlLabel}>{field.label}</BS.Col>
      <BS.Col sm={6}>
        <BS.FormControl
          type={field.type}
          placeholder={field.placeholder ? field.placeholder : ''}
          {...field.input} />
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
    <BS.FormControl
      type={field.type}
      placeholder={field.placeholder ? field.placeholder : ''}
      {...field.input} />
    {hasFieldError(field) &&
      <BS.HelpBlock className="text-danger">{field.meta.error}</BS.HelpBlock>}
  </BS.FormGroup>;

export default renderInput;
