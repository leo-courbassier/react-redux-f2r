import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link, IndexLink } from 'react-router';
import _ from 'underscore';
import * as BS from 'react-bootstrap';

import SubmitButton from './SubmitButton';
import StripeCheckout from './StripeCheckout';

class CheckoutForm extends Component {

  constructor() {
    super();

    this.state = {
      isCheckoutButtonVisible:false,
      stripeError:null
    };
  }

  componentWillUnmount() {
    this.props.clearCheckoutForm();
  }

  isPaymentPanelVisible() {
    // check if user already has stripe configured
    for (let acct of this.props.appState.accts) {
      if (acct === 'STRIPE') {
        return false;
      }
    }
    return true;
  }

  checkoutKeypress(e) {
    this.props.updateCheckoutForm(this.props.appState, e.target.name, e.target.value);
  }

  checkDiscountCode (e) {
    e.preventDefault();
    this.props.checkDiscountCode(this.props.appState.price, this.props.appState.discountCode);
  }

  removeService(id, price) {
    if (this.props.appState.discountCode) {
      this.props.checkDiscountCode(this.props.appState.price + this.props.appState.discountValue - price, this.props.appState.discountCode);
    }
    this.props.removeService(id, price);
  }

  stripeLoaded() {
    this.setState({
      isCheckoutButtonVisible:true
    });
  }

  submit (e) {
    e.preventDefault();
    if (this.isPaymentPanelVisible()) {
      this.refs.stripe.submit(e, (error) => {
        if (error) {
          this.setState({
            stripeError: 'You must fill out the payment details form.'
          });
        }
      });
    } else {
      this.setState({
        stripeError:null
      });
      this.props.sendPayment({
        productIds:this.props.appState.services,
        discountCode:this.props.appState.discountCode
      }, (success) => {
        if (success) window.scrollTo(0, 0);
      });
    }
  }

  formatMoney (amount, includeDollarSign = false) {
    const formattedAmount = amount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    return includeDollarSign ? '$'+formattedAmount : formattedAmount;
  }

  render () {
    const checkoutButton = (
      <div className="checkout-submit">
        {(this.isPaymentPanelVisible(this) === false || (this.isPaymentPanelVisible(this) && this.state.isCheckoutButtonVisible)) && (
          <SubmitButton
            appState={this.props.appState}
            statusAction="checkoutSubmit"
            disabled={this.props.appState.status.loading['discountSubmit']}
            submit={this.submit.bind(this)}
            textLoading="Processing...">
            Checkout
          </SubmitButton>
        )}
      </div>
    );

    const orderHeader = (
      <div className="order-heading clearfix">
        <h1 className="pull-left">Your Order</h1>
        <div className="pull-right">
          {checkoutButton}
        </div>
      </div>
    );

    const catalogPanelTitle = (
      <h2>Items in Your Order</h2>
    );
    const catalogContent = (
      <div>
        <BS.Table hover>
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Price</th>
              <th>Total</th>
              <th>{/* column with remove button */}</th>
            </tr>
          </thead>
          <tbody>
          {this.props.appState.catalog.map((item, i) => {
              let showRow = true;
              if (item.title === 'F2R Guarantor Verification Service') {
                showRow = this.props.appState.hasGuarantor;
              }
              return showRow && (
                <tr key={i}>
                  <td>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </td>
                  <td>{this.formatMoney(item.price, true)}</td>
                  <td>{this.formatMoney(this.props.appState.prices[i].price, true)}</td>
                  {item.title !== 'F2R Rent Mandate Verification Service' ? (
                    <td>
                      <BS.Button
                        bsStyle="default"
                        bsSize="small"
                        onClick={_.partial(this.removeService.bind(this), item.id, item.price)}>
                        Remove
                      </BS.Button>
                    </td>
                  ) : (
                    <td />
                  )}
                </tr>
              );
          })}
          </tbody>
        </BS.Table>
      </div>
    );
    const catalogPanel = (
      <BS.Panel className='checkout-panel' header={catalogPanelTitle} bsStyle="default">
        {catalogContent}
      </BS.Panel>
    );

    const discountPanelTitle = (
      <h2>Broker or Employer Code</h2>
    );
    const discountContent = (
      <div>
        <form>
          <BS.FormGroup>
            <BS.HelpBlock>If you were referred by a Broker or are employed by one of our Corporate Partners, enter the code they provided you here:</BS.HelpBlock>
            {this.props.appState.discountSuccess ? (
                <div className="text-success">Discount applied.</div>
              ) : (
                <BS.FormControl
                  onChange={this.checkoutKeypress.bind(this)}
                  name="discountCode"
                  type="text"
                  placeholder="Enter code here..." />
              )}
          </BS.FormGroup>
          <BS.FormGroup>
            {!this.props.appState.discountSuccess && (
              <SubmitButton
                appState={this.props.appState}
                statusAction="discountSubmit"
                submit={this.checkDiscountCode.bind(this)}
                textLoading="Calculating...">
                Calculate Discount
              </SubmitButton>
            )}
          </BS.FormGroup>
          {!this.props.appState.discountSuccess && (
            <div className="text-danger">{this.props.appState.discountError}</div>
          )}
        </form>
      </div>
    );
    const discountPanel = (
      <BS.Panel className='checkout-panel' header={discountPanelTitle} bsStyle="default">
        {discountContent}
      </BS.Panel>
    );

    const totalPanelTitle = (
      <h2>Order Total</h2>
    );
    const totalContent = (
      <div>
        <BS.Table hover>
          <tbody>
            <tr>
              <td><b>Subtotal</b></td>
              <td>&nbsp;{this.formatMoney(this.props.appState.price + this.props.appState.discountValue, true)}</td>
            </tr>
            <tr>
              <td><b>Discount</b></td>
              <td>-{this.formatMoney(this.props.appState.discountValue, true)}</td>
            </tr>
            <tr>
              <td><b>Taxes</b></td>
              <td>&nbsp;$0.00</td>
            </tr>
            <tr className="order-total-row">
              <td><b>Order Total</b></td>
              <td>&nbsp;{this.formatMoney(this.props.appState.price, true)}</td>
            </tr>
          </tbody>
        </BS.Table>
      </div>
    );
    const totalPanel = (
      <BS.Panel className='checkout-panel' header={totalPanelTitle} bsStyle="default">
        {totalContent}
      </BS.Panel>
    );

    const paymentPanelTitle = (
      <h2>Payment Details</h2>
    );
    const paymentContent = (
      <div>
        <StripeCheckout
          ref="stripe"
          keypress={this.checkoutKeypress.bind(this)}
          update={this.props.updateCheckoutForm.bind(this)}
          sendPayment={this.props.sendPayment}
          appState={this.props.appState}
          stripeLoaded={this.stripeLoaded.bind(this)}
          statusAction="checkoutSubmit" />
        <div className="text-center">Clicking the Checkout button will <strong>charge your card for {this.formatMoney(this.props.appState.price, true)}</strong>.</div>
      </div>
    );
    const paymentPanel = (
      <BS.Panel className='checkout-panel' header={paymentPanelTitle} bsStyle="default">
        {paymentContent}
      </BS.Panel>
    );

    const paymentExistsPanelTitle = (
      <h2>Payment Details</h2>
    );
    const paymentExistsContent = (
      <div>We already have your payment details from a previous step.<br />Clicking the Checkout button will <strong>charge your card for {this.formatMoney(this.props.appState.price, true)}</strong>.</div>
    );
    const paymentExistsPanel = (
      <BS.Panel className='checkout-panel' header={paymentExistsPanelTitle} bsStyle="default">
        {paymentExistsContent}
      </BS.Panel>
    );

    const finishedPanelTitle = (
      <h2>Payment Successful</h2>
    );
    const finishedContent = (
      <div className="finished-content">
        <BS.Col md={5}>
          <div className="finished-content-image">
            <img src="/onboarding/dog_checked_out.jpg" alt="" />
          </div>
        </BS.Col>
        <BS.Col md={7}>
          <p className="text-success">All set! We'll take it from here.<br />Securing your next place just got easier.</p>
          <p>We’ll verify your employment, past landlords, guarantor, and other attributes. As soon as this is completed, we'll notify you to download your full report.</p>
          <p><b>Help get your Rent Mandate quickly by reminding your previous landlords and employer to provide feedback via the email we sent them and letting them know we'll be in touch.</b></p>
          <p>We are excited to be your matchmaker! Now, go get packing!</p>
          <p><i>Should you have any questions while we’re busy confirming your entries, please email us at <a href="mailto:customersupport@fittorent.com" target="_blank">customersupport@fittorent.com</a>.</i></p>
        </BS.Col>
      </div>
    );
    const finishedPanel = (
      <BS.Panel className='checkout-panel finished-panel' header={finishedPanelTitle} bsStyle="success">
        {finishedContent}
      </BS.Panel>
    );

    const errorMessage = (
      <div className="text-danger card-error">There was a problem processing your credit card, please check the information and try again or try a different credit card.</div>
    );

    const errorMessageStripe = (
      <div className="text-danger card-error">{this.state.stripeError}</div>
    );

    return (
      <div>
        {!this.props.appState.success ? (
          <div>
            {orderHeader}
            {this.props.appState.success === false && errorMessage}
            {this.state.stripeError && errorMessageStripe}
            {catalogPanel}
            {discountPanel}
            {totalPanel}
            {this.isPaymentPanelVisible(this) ? paymentPanel : paymentExistsPanel}
            {this.props.appState.success === false && errorMessage}
            {checkoutButton}
          </div>
        ) : (
          <div>
            {finishedPanel}
          </div>
        )}
      </div>
    );
  }
}

export default CheckoutForm;
