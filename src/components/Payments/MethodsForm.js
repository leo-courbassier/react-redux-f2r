import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import { Field, SubmissionError } from 'redux-form';

import { renderInput, renderSelect, SelectInput, DateInput } from '../ReduxFormFields';
import DwollaPayment from '../DwollaPayment';
import ButtonSpinner from '../ButtonSpinner';

import { MAX_FUNDING_SOURCES, MAX_CREDIT_CARDS } from '../../constants/App';

class MethodsForm extends Component {

  state = {
    showAccountSetup: false,
    dobError: null
  }

  openAccountSetup() {
    this.setState({ showAccountSetup: true });
  }

  fundingSourceAdded() {
    this.setState({ showAccountSetup: false });
  }

  handleSubmit = (values) => {
    let { firstName, lastName, email, address, state, city, zip, dateOfBirth, ssn, phone } = values;

    // Format phone number
    if (phone.replace(/\D/g,'').trim().length === 10) {
      let number = phone.replace(/\D/g,'').trim();
      let parts = [number.substring(0, 3), number.substring(3, 6), number.substring(6, 10)];
      phone = `(${parts[0]}) ${parts[1]}-${parts[2]}`;
    }

    const payload = {
      "first_name": firstName,
      "last_name": lastName,
      "email": email,
      "dob": dateOfBirth,
      "address1": address,
      "city": city,
      "state": state,
      "zipCode": zip,
      "phone": phone,
      "ssnLast4": ssn
    };

    return this.props.createCustomer(payload);
  }

  renderCreateCustomerForm() {
    const { appState, handleSubmit } = this.props;
    const { fundingSources, creditCards, stateList, cityList, customerCreated } = appState;

    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
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
              onValueChange={this.props.getCityList}
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
    const { appState, handleSubmit } = this.props;
    const { fundingSources, creditCards, stateList, cityList, customerCreated } = appState;

    return (
      <div className="paymentmethodsform-panel">
        <div className="section">Bank Accounts</div>
        {fundingSources.length < 1 && (
          <div>No accounts added.</div>
        )}
        {fundingSources.length <= MAX_FUNDING_SOURCES && (
          <div className="add-funding-source">
            <div className="section">Add a Bank Account</div>
            {this.state.showAccountSetup ? (
              customerCreated ? (
                <DwollaPayment
                  type="setup"
                  callback={this.fundingSourceAdded.bind(this)}
                  noHeading
                />
              ) : this.renderCreateCustomerForm()
            ) : (
              <div className="add-funding-source-button">
                <BS.Button
                  onClick={this.openAccountSetup.bind(this)}
                  bsStyle="success"
                  bsSize="small">
                  {fundingSources.length > 0 ? 'Add Another Account' : 'Add Account'}
                </BS.Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

}

MethodsForm.contextTypes = {
  store: PropTypes.object
};

export default MethodsForm;
