import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import { Field } from 'redux-form';

import { renderInput, renderSelect, SelectInput, DateInput } from '../ReduxFormFields';
import DwollaPayment from '../DwollaPayment';
import StripePayment from '../StripePayment';
import ButtonSpinner from '../ButtonSpinner';
import SubmitButton from '../SubmitButton';
import Loader from '../Loader';

import { MAX_FUNDING_SOURCES, MAX_CREDIT_CARDS } from '../../constants/App';

class MethodsForm extends Component {

  state = {
    showAccountSetup: false,
    showStripe: false,
    showRemoveFundingSourceModal: false,
    removeFundingSourceData: null,
    showRemoveCreditCardModal: false,
    removeCreditCardData: null
  }

  openAccountSetup() {
    this.setState({ showAccountSetup: true });
  }

  openStripe() {
    this.setState({ showStripe: true });
  }

  removeFundingSource(source) {
    this.props.removeFundingSource(source.id, success => {
      if (success) this.closeRemoveFundingSourceModal();
    });
  }

  removeCreditCard(card) {
    this.props.removeCreditCard(card.id, success => {
      if (success) this.closeRemoveCreditCardModal();
    });
  }

  confirmRemoveFundingSource(source) {
    this.setState({
      showRemoveFundingSourceModal: true,
      removeFundingSourceData: source
    });
  }

  closeRemoveFundingSourceModal() {
    this.setState({ showRemoveFundingSourceModal: false });
  }

  confirmRemoveCreditCard(card) {
    this.setState({
      showRemoveCreditCardModal: true,
      removeCreditCardData: card
    });
  }

  closeRemoveCreditCardModal() {
    this.setState({ showRemoveCreditCardModal: false });
  }

  addFundingSource() {
    this.setState({ showAccountSetup: false });
    this.props.loadFundingSources();
  }

  addCreditCard() {
    this.setState({ showStripe: false });
    this.props.loadCreditCards();
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

  renderRemoveFundingSourceModal() {
    const { removeFundingSourceSuccess } = this.props.appState;

    return (
      <div className="remove-funding-source-modal">
        <BS.Modal
          show={this.state.showRemoveFundingSourceModal}
          onHide={this.closeRemoveFundingSourceModal.bind(this)}
          backdrop='static'>
          <BS.Modal.Header>
            <BS.Modal.Title>Remove Connected Bank Account</BS.Modal.Title>
          </BS.Modal.Header>
          <BS.Modal.Body>
            <p>Clicking "Remove Bank and Account" will completely remove your connected bank and account.</p>
            <p>{`In order to receive rental deposits and payments, you'll have to connect and verify another bank and account.`}</p>
            <p>This will also affect recurring payments for services like your document storage.</p>
            <p>Are you sure you want to proceed?</p>
            {removeFundingSourceSuccess === false && (
              <div className="text-danger text-center">
                <strong>Error removing account. Please try again later.</strong>
              </div>
            )}
          </BS.Modal.Body>
          <BS.Modal.Footer className="clearfix">
            <div className="pull-left">
              <BS.Button
                onClick={this.closeRemoveFundingSourceModal.bind(this)}>
                Close
              </BS.Button>
            </div>
            <div className="pull-right">
              <SubmitButton
                submit={this.removeFundingSource.bind(this, this.state.removeFundingSourceData)}
                appState={this.props.appState}
                statusAction="removeFundingSource"
                textLoading="Removing"
                bsStyle="danger">
                Remove Bank and Account
              </SubmitButton>
            </div>
          </BS.Modal.Footer>
        </BS.Modal>
      </div>
    );
  }

  renderRemoveCreditCardModal() {
    const { removeCreditCardSuccess } = this.props;

    return (
      <div className="remove-credit-card-modal">
        <BS.Modal
          show={this.state.showRemoveCreditCardModal}
          onHide={this.closeRemoveCreditCardModal.bind(this)}
          backdrop='static'>
          <BS.Modal.Header>
            <BS.Modal.Title>Remove Connected Credit Card</BS.Modal.Title>
          </BS.Modal.Header>
          <BS.Modal.Body>
            <p>Clicking "Remove Credit Card" will completely remove your connected credit card.</p>
            <p>Are you sure you want to proceed?</p>
            {removeCreditCardSuccess === false && (
              <div className="text-danger text-center">
                <strong>Error removing credit card. Please try again later.</strong>
              </div>
            )}
          </BS.Modal.Body>
          <BS.Modal.Footer className="clearfix">
            <div className="pull-left">
              <BS.Button
                onClick={this.closeRemoveCreditCardModal.bind(this)}>
                Close
              </BS.Button>
            </div>
            <div className="pull-right">
              <SubmitButton
                submit={this.removeCreditCard.bind(this, this.state.removeCreditCardData)}
                appState={this.props.appState}
                statusAction="removeCreditCard"
                textLoading="Removing"
                bsStyle="danger">
                Remove Credit Card
              </SubmitButton>
            </div>
          </BS.Modal.Footer>
        </BS.Modal>
      </div>
    );
  }

  renderCreateCustomerForm() {
    const { appState, handleSubmit } = this.props;
    const { fundingSources, creditCards, stateList, cityList } = appState;

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
    const { fundingSources, creditCards, customerCreated } = appState;

    return (
      <div className="paymentmethodsform-panel">
        <div className="section">Bank Accounts</div>
        {fundingSources.length < 1 && (
          <div>No accounts added.</div>
        )}
        {fundingSources.length > 0 && (
          <BS.Table className="data-table" striped bordered responsive>
            <thead>
              <tr>
                <td>Bank Account</td>
                <td>Status</td>
                <td>Default</td>
                <td>{/* Remove button */}</td>
              </tr>
            </thead>
            <tbody>
              {fundingSources.map((source, i) => (
                <tr key={i}>
                  <td>{source.name}</td>
                  <td>Verified</td>
                  <td>
                  {source.isDefault ? 'Yes' : (
                    <SubmitButton
                      submit={() => { this.props.setDefaultFundingSource(source.id); }}
                      appState={this.props.appState}
                      statusAction={`setFundingSourceDefault${source.id}`}
                      textLoading="Setting..."
                      bsStyle="default"
                      bsSize="small">
                      Set Default
                    </SubmitButton>
                  )}
                  </td>
                  <td>
                    <BS.Button
                      onClick={this.confirmRemoveFundingSource.bind(this, source)}
                      bsStyle="default"
                      bsSize="small">
                      Remove
                    </BS.Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </BS.Table>
        )}
        {fundingSources.length <= MAX_FUNDING_SOURCES && (
          <div className="add-funding-source">
            {this.state.showAccountSetup ? (
              <div>
                <div className="section">Add a Bank Account</div>
                {customerCreated ? (
                  <DwollaPayment
                    type="setup"
                    dwollaCallback={this.addFundingSource.bind(this)}
                    noHeading
                  />
                ) : this.renderCreateCustomerForm()}
              </div>
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
        <div className="section">Credit/Debit Card</div>
        {creditCards.length < 1 && (
          <div>No card added.</div>
        )}
        {creditCards.length > 0 && (
          <BS.Table className="data-table" striped bordered responsive>
            <thead>
              <tr>
                <td>Card</td>
                <td>Type</td>
                <td>Account Number</td>
                <td>Expiration</td>
                <td>{/* Remove button */}</td>
              </tr>
            </thead>
            <tbody>
              {creditCards.map((card, i) => (
                <tr key={i}>
                  <td>{card.brand}</td>
                  <td>{card.funding.charAt(0).toUpperCase() + card.funding.slice(1)}</td>
                  <td>XXXX XXXX XXXX {card.last4}</td>
                  <td>{`${card.expMonth} / ${card.expYear}`}</td>
                  <td>
                    <BS.Button
                      onClick={this.confirmRemoveCreditCard.bind(this, card)}
                      bsStyle="default"
                      bsSize="small">
                      Remove
                    </BS.Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </BS.Table>
        )}
        {creditCards.length < MAX_CREDIT_CARDS && (
          <div className="add-credit-card">
            {this.state.showStripe ? (
              <StripePayment
                type="setup"
                callback={this.addCreditCard.bind(this)}
                />
            ) : (
              <div className="add-credit-card-button">
                <BS.Button
                  onClick={this.openStripe.bind(this)}
                  bsStyle="success"
                  bsSize="small">
                  {creditCards.length > 0 ? 'Add Another Card' : 'Add Card'}
                </BS.Button>
              </div>
            )}
          </div>
        )}
        {this.renderRemoveFundingSourceModal()}
        {this.renderRemoveCreditCardModal()}
      </div>
    );
  }

}

MethodsForm.contextTypes = {
  store: PropTypes.object
};

export default MethodsForm;
