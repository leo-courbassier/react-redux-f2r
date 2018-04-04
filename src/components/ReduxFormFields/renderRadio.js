import React from 'react';
import * as BS from 'react-bootstrap';
import { Field } from 'redux-form';
import { hasFieldError } from './helpers';

/*eslint-disable */
const handleChange = (field, e) => {
	let value = e.target.value;
	if (value === 'true') value = true;
	if (value === 'false') value = false;
	field.input.onChange(value);
};

/*eslint-disable */
const renderRadio = field =>
  <BS.FormGroup validationState={hasFieldError(field) ? 'error' : null}>
    <label className="radio-inline">
      <Field component="input" type="radio" {...field.input} value={field.staticValue}
      	onChange={function(e) { handleChange(field, e); }}
      	onBlur={function(e) { handleChange(field, e); }} />
      {field.label}
    </label>
    {hasFieldError(field) &&
     <BS.HelpBlock className="text-danger">{field.meta.error}</BS.HelpBlock>}
  </BS.FormGroup>;

export default renderRadio;
