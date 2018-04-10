import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import { Field } from 'redux-form';

import { renderInput, renderSelect, SelectInput, DateInput } from '../ReduxFormFields';

import { MAX_FUNDING_SOURCES, MAX_CREDIT_CARDS } from '../../constants/App';

class MethodsForm extends Component {

  state = {
    showAccountSetup: false
  }

  openAccountSetup() {
    this.setState({ showAccountSetup: true });
  }

  handleFormSubmit = (values, e) => {
    e.preventDefault();
    console.log(values);
  }

  renderFooter() {
    const { submitting, errors, submitSucceeded } = this.props;
    return (
      <div className="paymentmethods-submit">
        <div className="paymentmethods-submit-message">
          {errors && (
            <BS.HelpBlock>
              <span className="text-danger">{errors}</span>
            </BS.HelpBlock>
          )}
          {submitSucceeded && (
            <BS.HelpBlock>
              <span className="text-success">Changes saved successfully.</span>
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
    const { appState } = this.props;
    const { fundingSources, creditCards, stateList, cityList } = appState;

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
              <form onSubmit={this.handleFormSubmit.bind(this)}>
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
                  <div className="item"></div>
                </div>
                <div className="form-group">
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
            ) : (
              <BS.Button
                onClick={this.openAccountSetup.bind(this)}
                bsStyle="success"
                bsSize="small">
                {fundingSources.length > 0 ? 'Add Another Account' : 'Add Account'}
              </BS.Button>
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
