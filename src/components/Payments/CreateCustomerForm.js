import React, { Component } from 'react';
import * as BS from 'react-bootstrap';
import { reduxForm, Field } from 'redux-form';
import { renderInput, renderSelect, SelectInput, DateInput } from '../ReduxFormFields';
import { isValidEmail, isValidPhone } from '../ReduxFormFields/helpers';
import ButtonSpinner from '../ButtonSpinner';

const validate = values => {
  const errors = {};
  const { firstName, lastName, email, address, state, city, zip, dateOfBirth, ssn, phone } = values;

  if (!firstName) {
    errors.firstName = 'First name is required.';
  }

  if (!lastName) {
    errors.lastName = 'Last name is required.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email address.';
  }

  if (!address) {
    errors.address = 'Address is required.';
  }

  if (!state) {
    errors.state = 'State is required.';
  }

  if (!city) {
    errors.city = 'City is required.';
  }

  if (!zip) {
    errors.zip = 'Zip Code is required.';
  }

  if (!dateOfBirth) {
    errors.dateOfBirth = 'Date of Birth is required.';
  } else {
    let parts = dateOfBirth.split('-');
    for (let part of parts) {
      if (part === '' || part === 'undefined') {
        errors.dateOfBirth = 'Date of Birth is required.';
      }
    }
  }

  if (!ssn) {
    errors.ssn = 'Last 4 of SSN is required.';
  } else if (ssn.length !== 4 || isNaN(parseFloat(ssn))) {
    errors.ssn = 'Last 4 of SSN is invalid.';
  }

  if (!phone) {
    errors.phone = 'Phone Number is required.';
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Phone Number is invalid.';
  }

  return errors;
};

class CreateCustomerForm extends Component {

  renderFooter() {
    const { submitting, errors } = this.props;
    return (
      <div className="paymentmethods-submit">
        <div className="paymentmethods-submit-message">
          {errors && (
            <BS.HelpBlock>
              <span className="text-danger">{errors}</span>
            </BS.HelpBlock>
          )}
        </div>
        <div className="paymentmethods-submit-button">
          <BS.Button
            className="submit-button"
            bsStyle="success"
            disabled={submitting}
            type="submit">
            {submitting && <div className="spinner"><ButtonSpinner /></div>}
            <div className="text">Save</div>
          </BS.Button>
        </div>
      </div>
    );
  }

  render() {
    const { stateList, cityList, getCityList, handleSubmit, onSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row has-gutters">
          <div className="item">
            <Field
              name="firstName"
              label="First Name"
              type="text"
              component={renderInput}
            />
          </div>
          <div className="item">
            <Field
              name="lastName"
              label="Last Name"
              type="text"
              component={renderInput}
            />
          </div>
        </div>
        <div className="form-group">
          <Field
            name="email"
            label="Email"
            type="text"
            component={renderInput}
          />
        </div>
        <div className="form-group">
          <Field
            name="address"
            label="Home Address"
            type="text"
            component={renderInput}
          />
        </div>
        <div className="row has-gutters">
          <div className="item">
            <Field
              name="state"
              label="State"
              optionList={stateList}
              component={SelectInput}
              onValueChange={getCityList}
              defaultOptionName="Choose a state ..."
            />
          </div>
          <div className="item">
            <Field
              name="city"
              label="City"
              optionList={cityList}
              component={SelectInput}
              defaultOptionName="Choose a city ..."
            />
          </div>
          <div className="item">
            <Field
              name="zip"
              label="Zip Code"
              type="text"
              component={renderInput}
            />
          </div>
        </div>
        <div className="form-group">
          <BS.ControlLabel>Date of Birth</BS.ControlLabel>
          <Field
            name="dateOfBirth"
            component={DateInput}
          />
        </div>
        <div className="row has-gutters">
          <div className="item">
            <Field
              name="ssn"
              label="Last 4 of SSN"
              type="text"
              component={renderInput}
            />
          </div>
          <div className="item">
            <Field
              name="phone"
              label="Phone"
              placeholder="ex: (555) 555 5555"
              type="text"
              component={renderInput}
            />
          </div>
        </div>
        {this.renderFooter()}
      </form>
    );
  }

}

export default reduxForm({
  form: 'createCustomerForm',
  validate
})(CreateCustomerForm);
