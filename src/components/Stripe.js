import React, { Component, PropTypes } from 'react';
import SubmitButton from './SubmitButton';
import reactMixin from 'react-mixin';
import {ReactScriptLoaderMixin} from 'react-script-loader';
import * as BS from 'react-bootstrap';
import _ from 'underscore';
import Validator from 'validator';

import * as api from '../actions/api';

const STEP_ID = 3;

class StripeCheckout extends Component {

  state = {
    stripeLoading: true,
    stripeLoadingError: false,
    paymentError: null,
    paymentComplete: false,
    token: null
  }

  componentDidMount(){

  }

  getScriptURL() {
    return 'https://js.stripe.com/v2/';
  }

  onScriptLoaded() {
    let Stripe = window.Stripe;
    // Stripe.setPublishableKey('pk_test_9sfO7SgxwPOYrh5fTPKNN2w9');
    Stripe.setPublishableKey('pk_live_UAliz3GcbxSxzMqG9Mi4hU8h');
    this.setState({ stripeLoading: false, stripeLoadingError: false });
  }

  onScriptError() {
    this.setState({ stripeLoading: false, stripeLoadingError: true });
  }

  showStripeStatus(){
    let store = this.props.appState[STEP_ID];
    let stripeAmount = store.stripeAmount;
    if (store.stripeAmount != null) {
      stripeAmount = store.stripeAmount.toString().trim().replace(/\$|,/g, '');
    }
    if (store.stripeAmount != null && !Validator.isCurrency(stripeAmount, {allow_negatives: false, thousands_separator: '.', decimal_separator: '.'})) {
      return <div>Amount must be in 0.00 format</div>;
    }
    else if (this.state.stripeLoading) {
      return <div>Loading</div>;
    }
    else if (this.state.stripeLoadingError) {
      return <div>Error</div>;
    }
    else if (this.state.paymentError) {
      return <div>{this.state.paymentError}</div>;
    }
    else if (this.state.paymentComplete) {
      return <div>{store.stripeTransactionStatus}</div>;
    } else {
      return null;
    }
  }


  submit(e) {
    e.preventDefault();

    api.setStatus(this.context.store.dispatch, 'saving', 'stripeForm', true);
    let Stripe = window.Stripe;

    let self = this;
    this.setState({ paymentError: null });


    let store = this.props.appState[STEP_ID];

    let cardDetails = {
      'number': store.stripeNumber,
      'exp-month': store.stripeExpiryMonth,
      'exp-year': store.stripeExpiryYear,
      'cvc': store.stripeCVC

    };

    Stripe.createToken(cardDetails, function(status, response) {
      if (response.error) {
        self.setState({ paymentError: response.error.message });
        api.setStatus(self.context.store.dispatch, 'loading', 'stripeForm', false);
        api.setStatus(self.context.store.dispatch, 'saving', 'stripeForm', false);
      }
      else {
        self.setState({ paymentComplete: true, token: response.id });

        // remove $ and ,
        let stripeAmount = store.stripeAmount;
        stripeAmount = parseFloat(stripeAmount.toString().trim().replace(/\$|,/g, ''));

        // apply 4% transaction fee and convert to pennies, rounded to the nearest cent
        stripeAmount = (stripeAmount * 1.04);
        stripeAmount = Math.round(stripeAmount * 100);

        let payload = {
          "amount": stripeAmount,
          "currency":"usd",
          "description":"stripe security deposit",
          "one_time_use_token": response.id,
          "remember_customer":"true",
          "paymentType":"TT_PAY_F2R_SEC_DEPOSIT"
        };

        let userId = self.context.store.getState().loginAppState.userInfo.id;
        self.props.saveStripe(payload, userId, self.props.updateOnboardingScore);

      }


    });


  }


  render() {

    let store = this.props.appState[STEP_ID];

    return (
      <div className="stripe-checkout-container">


        <div className="section">Post with a Card</div>

        <form>
          <BS.FormGroup controlId="guarantor">
          <div className="row">
            <div className="item amount">
              <BS.ControlLabel>Amount (USD $)</BS.ControlLabel>
              <BS.InputGroup>
                <BS.InputGroup.Addon>$</BS.InputGroup.Addon>
                <BS.FormControl
                onChange={_.partial(this.props.keypress.bind(this), 'stripeForm')}
                data-stripe='amount'
                placeholder="0.00"
                value={store.stripeAmount}
                name="stripeAmount"
                type="text" />
              </BS.InputGroup>
            </div>
          </div>
          <div className="row">
            <div className="item card-number">
              <BS.ControlLabel>Card Number</BS.ControlLabel>
              <BS.FormControl
              onChange={_.partial(this.props.keypress.bind(this), 'stripeForm')}
              data-stripe='number'
              value={store.stripeNumber}
              name="stripeNumber"
              type="text" />
            </div>
            <div className="item expiry">
              <BS.ControlLabel>Month</BS.ControlLabel>
              <BS.FormControl
              onChange={_.partial(this.props.keypress.bind(this), 'stripeForm')}
              data-stripe='exp-month'
              placeholder="MM"
              value={store.stripeExpiryMonth}
              name="stripeExpiryMonth"
              type="text" />
            </div>
            <div className="item expiry">
              <BS.ControlLabel>Year</BS.ControlLabel>
              <BS.FormControl
              onChange={_.partial(this.props.keypress.bind(this), 'stripeForm')}
              data-stripe='exp-year'
              placeholder="YY"
              value={store.stripeExpiryYear}
              name="stripeExpiryYear"
              type="text" />
            </div>
            <div className="item cvc">
              <BS.ControlLabel>CVC</BS.ControlLabel>
              <BS.FormControl
              onChange={_.partial(this.props.keypress.bind(this), 'stripeForm')}
              data-stripe='cvc'
              value={store.stripeCVC}
              name="stripeCVC"
              type="text" />
            </div>
          </div>
          </BS.FormGroup>
        </form>

        {this.state.paymentComplete ? (
          <BS.HelpBlock>
            <div className="stripe-success-message text-success text-center">
              <strong>{this.showStripeStatus()}</strong>
            </div>
          </BS.HelpBlock>
        ) : (
          <BS.HelpBlock className="text-center">
            {this.showStripeStatus()}
          </BS.HelpBlock>
        )}

        <br />

          <SubmitButton
          className="stripe-submit pullRight"
          appState={this.props.appState}
          statusAction="stripeForm"
          submit={this.submit.bind(this)}
          textLoading="Submitting"
          textModified="Submit Deposit">
            Submit Deposit
          </SubmitButton>

      </div>
    );
  }

}

reactMixin(StripeCheckout.prototype, ReactScriptLoaderMixin);

StripeCheckout.propTypes = {
  children: PropTypes.element
};

StripeCheckout.contextTypes = {
  store: PropTypes.object
};

export default StripeCheckout;
