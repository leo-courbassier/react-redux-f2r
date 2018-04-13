import React, { Component } from 'react';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';
import { isCurrency } from 'validator';
import { reduxForm, formValueSelector, Field } from 'redux-form';
import { renderInput, renderSelect, renderCheckboxGroup, SelectInput, DateInput } from '../ReduxFormFields';
import ButtonSpinner from '../ButtonSpinner';

const validate = values => {
  const errors = {};
  const { lease, amount, type, frequency, recipients } = values;

  // remove $ and ,
  const newAmount = amount && amount.toString().trim().replace(/\$|,/g, '');

  if (!lease) errors.lease = 'Lease is required.';
  if (!newAmount) {
    errors.amount = 'Amount is required';
  } else if (!isCurrency(newAmount, {allow_negatives: false, thousands_separator: '.', decimal_separator: '.'})) {
    errors.amount = 'Amount must be in 0.00 format.';
  }
  if (!type) errors.type = 'Type is required';
  if (!frequency) errors.frequency = 'Frequency is required.';
  if (!recipients || (recipients && recipients.length < 1)) {
    errors.recipients = 'Recipients is required.';
  }

  return errors;
};

class RequestPaymentForm extends Component {

  componentWillMount() {
    const { leases, initialize } = this.props;
    if (leases.length > 0) {
      initialize({
        lease: leases[0].id
      });
    }
  }

  handleSubmit(values) {
    return this.props.onSubmit(values).then(response => {
      let success = !(typeof response === 'object' && 'status' in response && response.status !== 200);
      if (success) this.props.reset();
    });
  }

  getLeases() {
    const leases = this.props.leases;
    let leasesList = {};
    for (let lease of leases) {
      leasesList[lease.id] = `${lease.property.headline}`;
    }
    return leasesList;
  }

  getRecipients() {
    const tenants = this.props.tenants;
    let recipients = [];
    for (let tenant of tenants) {
      // Helps to prevent duplicate tenants
      if (recipients.indexOf(tenant.id) === -1) {
        recipients[tenant.id] = {
          value: tenant.id,
          label: `${tenant.firstName} ${tenant.lastName}`
        };
      }
    }
    return recipients;
  }

  renderFooter() {
    const { submitting, errors, requestPaymentSuccess, requestPaymentError, close } = this.props;
    return (
      <div className="paymentmake-submit">
        <div className="paymentmake-submit-message">
          {errors && (
            <BS.HelpBlock>
              <strong className="text-danger">{errors}</strong>
            </BS.HelpBlock>
          )}
          {requestPaymentSuccess === false && (
            <BS.HelpBlock>
              <strong className="text-danger">{requestPaymentError}</strong>
            </BS.HelpBlock>
          )}
          {requestPaymentSuccess === true && (
            <BS.HelpBlock>
              <strong className="text-success">Payment sent.</strong>
            </BS.HelpBlock>
          )}
        </div>
        <div className="paymentmake-submit-button clearfix">
          <div className="pull-left">
            <BS.Button
              bsStyle="default"
              disabled={submitting}
              onClick={close}
            >
              Cancel
            </BS.Button>
          </div>
          <div className="pull-right">
            <BS.Button
              className="submit-button"
              bsStyle="success"
              disabled={submitting}
              type="submit">
              {submitting && <div className="spinner"><ButtonSpinner /></div>}
              <div className="text">Send Request</div>
            </BS.Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { handleSubmit, type } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <div className="row has-gutters">
          <div className="item">
            <Field
              name="lease"
              label="Request from"
              component={SelectInput}
              optionList={this.getLeases()}
              defaultOption="Select Existing Lease..."
              defaultOptionName="Select Existing Lease..."
              keyValue
            />
            <Field
              name="amount"
              label="Amount"
              placeholder="0.00"
              type="text"
              component={renderInput}
            />
            <Field
              name="type"
              label="Type"
              component={renderSelect}
            >
              <option value="">Select Type...</option>
              <option>Deposit</option>
              <option>Rent</option>
              <option>Other</option>
            </Field>
            <Field
              name="frequency"
              label="Frequency"
              component={renderSelect}
            >
              <option value="">Select Frequency...</option>
              <option>One time payment</option>
              {type && type === 'Rent' && <option>Monthly</option>}
            </Field>
            <Field
              name="details"
              label="Details"
              placeholder="Optional: e.g., Request for pet deposit"
              type="text"
              component={renderInput}
            />
          </div>
          <div className="item">
            <Field
              name="recipients"
              label="Select Recipients"
              options={this.getRecipients()}
              component={renderCheckboxGroup}
            />
          </div>
        </div>
        {this.renderFooter()}
      </form>
    );
  }

}

export default connect(
  state => ({
    type: formValueSelector('requestPaymentForm')(state, 'type'),
  })
)(reduxForm({
  form: 'requestPaymentForm',
  validate
})(RequestPaymentForm));
