import React, { Component } from 'react';
import * as BS from 'react-bootstrap';
import { reduxForm, Field } from 'redux-form';
import { renderInput, renderSelect, SelectInput, DateInput } from '../ReduxFormFields';
import ButtonSpinner from '../ButtonSpinner';

const validate = values => {
  const errors = {};
  const { recipient, amount, source, details } = values;

  // TODO: Uncomment this line when empty array issue with tenants is fixed:
  // if (!recipient) errors.recipient = 'Tenant is required.';
  if (!amount) errors.amount = 'Amount is required';
  if (!source) errors.source = 'Bank account is required';
  if (!details) errors.details = 'Details are required.';

  return errors;
};

class MakePaymentForm extends Component {

  componentWillMount() {
    const { fundingSources, initialize } = this.props;
    if (fundingSources.length > 0) {
      initialize({
        source: fundingSources[0].id
      });
    }
  }

  handleSubmit(values) {
    return this.props.onSubmit(values).then(response => {
      let success = response.status == 'PENDING';
      if (success) {
        this.props.reset();
      }
    });
  }

  getRecipients() {
    const tenants = this.props.tenants;
    let recipients = {};
    for (let tenant of tenants) {
      recipients[tenant.id] = `${tenant.firstName} ${tenant.lastName}`;
    }
    return recipients;
  }

  getFundingSources() {
    const fundingSources = this.props.fundingSources;
    let sources = {};
    for (let source of fundingSources) {
      sources[source.id] = `${source.name}`;
    }
    return sources;
  }

  renderFooter() {
    const { submitting, errors, makePaymentSuccess, makePaymentError, close } = this.props;
    return (
      <div className="paymentmake-submit">
        <div className="paymentmake-submit-message">
          {errors && (
            <BS.HelpBlock>
              <strong className="text-danger">{errors}</strong>
            </BS.HelpBlock>
          )}
          {makePaymentSuccess === false && (
            <BS.HelpBlock>
              <strong className="text-danger">{makePaymentError}</strong>
            </BS.HelpBlock>
          )}
          {makePaymentSuccess === true && (
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
              <div className="text">Send Payment</div>
            </BS.Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <Field
          name="recipient"
          label="Send To"
          component={SelectInput}
          optionList={this.getRecipients()}
          defaultOption="Select Existing Tenant..."
          defaultOptionName="Select Existing Tenant..."
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
          name="source"
          label="Source"
          component={SelectInput}
          optionList={this.getFundingSources()}
          defaultOption="Select Bank Account..."
          defaultOptionName="Select Bank Account..."
          keyValue
        />
        <Field
          name="details"
          label="Details"
          placeholder="E.g., Refund of Tenant's Security Deposit"
          type="text"
          component={renderInput}
        />
        {this.renderFooter()}
      </form>
    );
  }

}

export default reduxForm({
  form: 'makePaymentForm',
  validate
})(MakePaymentForm);
