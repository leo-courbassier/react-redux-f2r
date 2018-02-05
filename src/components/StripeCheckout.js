import React, { Component, PropTypes } from 'react';
import SubmitButton from './SubmitButton';
import reactMixin from 'react-mixin';
import {ReactScriptLoaderMixin} from 'react-script-loader';
import * as BS from 'react-bootstrap';

import Validator from 'validator';

import * as api from '../actions/api';

// NOTE: This component does some operations specific to CheckoutPage.
// TODO: Merge this component with other Stripe component. or create a
//       base component that can be extended.
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
    this.props.stripeLoaded();
  }

  onScriptError() {
    this.setState({ stripeLoading: false, stripeLoadingError: true });
  }

  showStripeStatus(){
    let store = this.props.appState;
    if (store.stripeAmount != null && !Validator.isCurrency(store.stripeAmount, {allow_negatives: false, thousands_separator: '.', decimal_separator: '.'})) {
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


  submit(e, callback = function(){}) {
    e.preventDefault();

    api.setStatus(this.context.store.dispatch, 'loading', this.props.statusAction || 'stripeForm', true);
    let Stripe = window.Stripe;

    let self = this;
    this.setState({ paymentError: null });


    let store = this.props.appState;

    let cardDetails = {
      'number': store.stripeNumber,
      'exp-month': store.stripeExpiryMonth,
      'exp-year': store.stripeExpiryYear,
      'cvc': store.stripeCVC

    };

    Stripe.createToken(cardDetails, function(status, response) {
      if (response.error) {
        self.setState({ paymentError: response.error.message });
        api.setStatus(self.context.store.dispatch, 'loading', self.props.statusAction || 'stripeForm', false);
        callback(response.error.message);
      }
      else {
        self.setState({ paymentComplete: true, token: response.id });


        let payload = {
          "amount": (store.price * 100),
          "currency":"usd",
          "description":"stripe check out",
          "one_time_use_token": response.id,
          "remember_customer":"true",
          "paymentType":"TT_PAY_F2R_SERVICE_FEE",
          "productIds":store.services,
          "discountCode":store.discountCode || ''
        };

        self.props.sendPayment(payload, (success) => {
          if (success) window.scrollTo(0, 0);
        });

      }


    });


  }


  render() {

    let store = this.props.appState;

    return (
      <div className="stripe-checkout-container">

        <form>
          <BS.FormGroup controlId="guarantor">
          <div className="row">
            <div className="item card-number">
              <BS.ControlLabel>Card Number</BS.ControlLabel>
              <BS.FormControl
              onChange={this.props.keypress.bind(this)}
              data-stripe='number'
              value={store.stripeNumber}
              name="stripeNumber"
              type="text" />
            </div>
            <div className="item expiry">
              <BS.ControlLabel>Month</BS.ControlLabel>
              <BS.FormControl
              onChange={this.props.keypress.bind(this)}
              data-stripe='exp-month'
              placeholder="MM"
              value={store.stripeExpiryMonth}
              name="stripeExpiryMonth"
              type="text" />
            </div>
            <div className="item expiry">
              <BS.ControlLabel>Year</BS.ControlLabel>
              <BS.FormControl
              onChange={this.props.keypress.bind(this)}
              data-stripe='exp-year'
              placeholder="YY"
              value={store.stripeExpiryYear}
              name="stripeExpiryYear"
              type="text" />
            </div>
            <div className="item cvc">
              <BS.ControlLabel>CVC</BS.ControlLabel>
              <BS.FormControl
              onChange={this.props.keypress.bind(this)}
              data-stripe='cvc'
              value={store.stripeCVC}
              name="stripeCVC"
              type="text" />
            </div>
          </div>
          </BS.FormGroup>
        </form>

        <BS.HelpBlock>
          {this.showStripeStatus()}
        </BS.HelpBlock>

        {/*<br />

          <SubmitButton
          className="stripe-submit pullRight"
          appState={this.props.appState}
          statusAction="stripeForm"
          submit={this.submit.bind(this)}
          textLoading="Submitting">
            Submit
          </SubmitButton>*/}

      </div>
    );
  }

}

reactMixin(StripeCheckout.prototype, ReactScriptLoaderMixin);

StripeCheckout.propTypes = {
  children: PropTypes.element,
  stripeLoaded: PropTypes.func
};

StripeCheckout.contextTypes = {
  store: PropTypes.object
};

export default StripeCheckout;
