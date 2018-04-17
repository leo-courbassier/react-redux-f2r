import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import moment from 'moment';

import ButtonSpinner from '../ButtonSpinner';
import SubmitButton from '../SubmitButton';
import Loader from '../Loader';

class RecurringForm extends Component {

  state = {
    showForm: false,
    showRemoveRecurringModal: false,
    removeRecurringData: null
  }

  openForm() {
    this.setState({ showForm: true });
  }

  closeForm() {
    this.setState({ showForm: false });
  }

  confirmRemoveRecurring(data) {
    this.setState({
      showRemoveRecurringModal: true,
      removeRecurringData: data
    });
  }

  closeRemoveRecurringModal() {
    this.setState({ showRemoveRecurringModal: false });
  }

  removeRecurring(data) {
    this.props.removeRecurringPayment(data.id, success => {
      if (success) this.closeRemoveRecurringModal();
    });
  }

  handleSubmit = (values) => {
    // console.log(values);
  }

  renderRemoveRecurringModal() {
    const { removeRecurringSuccess } = this.props.appState;

    return (
      <div className="remove-recurring-modal">
        <BS.Modal
          show={this.state.showRemoveRecurringModal}
          onHide={this.closeRemoveRecurringModal.bind(this)}
          backdrop='static'>
          <BS.Modal.Header>
            <BS.Modal.Title>Remove Recurring Payment</BS.Modal.Title>
          </BS.Modal.Header>
          <BS.Modal.Body>
            <p>Clicking "Remove Recurring Payment" will completely remove your recurring payment.</p>
            <p>{`You will no longer have access to the document storage feature unless a new payment is setup by the billing date.`}</p>
            <p>Are you sure you want to proceed?</p>
            {removeRecurringSuccess === false && (
              <div className="text-danger text-center">
                <strong>{`Error removing recurring payment. Please try again later.`}</strong>
              </div>
            )}
          </BS.Modal.Body>
          <BS.Modal.Footer className="clearfix">
            <div className="pull-left">
              <BS.Button
                onClick={this.closeRemoveRecurringModal.bind(this)}>
                Close
              </BS.Button>
            </div>
            <div className="pull-right">
              <SubmitButton
                submit={this.removeRecurring.bind(this, this.state.removeRecurringData)}
                appState={this.props.appState}
                statusAction="removeRecurring"
                textLoading="Removing"
                bsStyle="danger">
                Remove Recurring Payment
              </SubmitButton>
            </div>
          </BS.Modal.Footer>
        </BS.Modal>
      </div>
    );
  }

  render() {
    const { appState } = this.props;
    const { recurring } = appState;

    return (
      <div className="paymentrecurringform-panel">
        {recurring.length < 1 && (
          <div>None currently setup.</div>
        )}
        {recurring.length > 0 && (
          <BS.Table className="data-table" striped bordered responsive>
            <thead>
              <tr>
                <td>Type</td>
                <td>Amount</td>
                <td>{`Date Billed`}</td>
                <td>Account</td>
                <td>{/* Remove button */}</td>
              </tr>
            </thead>
            <tbody>
              {recurring.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.description === 'monthly storage fee' ? 'Document Storage' : payment.description}</td>
                  <td>${payment.value}</td>
                  <td>{moment(payment.payment_date).format('Do') + ' of month'}</td>
                  <td>{payment.payer_acct_name}</td>
                  <td>
                    <BS.Button
                      onClick={this.confirmRemoveRecurring.bind(this, payment)}
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
        {this.renderRemoveRecurringModal()}
      </div>
    );
  }

}

RecurringForm.contextTypes = {
  store: PropTypes.object
};

export default RecurringForm;
