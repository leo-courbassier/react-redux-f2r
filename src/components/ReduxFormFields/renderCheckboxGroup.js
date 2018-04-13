import React from 'react';
import { FormGroup, ControlLabel, HelpBlock, Label } from 'react-bootstrap';
import { hasFieldError } from './helpers';

const Error = ({ meta : {touched, error} }) =>  (touched && error ? <HelpBlock>{error}</HelpBlock> : null);

const CheckboxGroup = (field) => {
  const { label, name, options,  input, meta} = field;
  return (
    <FormGroup controlId={name} validationState={hasFieldError(field) ? 'error' : null}>
      <ControlLabel>{label}</ControlLabel>
        { options.map((option, index) => (
          <div className="checkbox" key={index}>
            <label>
              <input type="checkbox"
                     name={`${name}[${index}]`}
                     value={option.value || option.label}
                     checked={input.value.indexOf(option.value || option.label) !== -1}
                     onChange={event => {
                       const newValue = [...input.value];
                       if (event.target.checked) {
                         newValue.push(option.value || option.label);
                       } else {
                         newValue.splice(newValue.indexOf(option.value || option.label), 1);
                       }

                       return input.onChange(newValue);
                     }}
              />
              {option.label}
            </label>
          </div>))
        }
      <Error meta={meta} />
    </FormGroup>
  );
};

export default CheckboxGroup;
