/**
 * StripePayment Component
 *
 * This component is meant to be generic so it is not coupled to a certain
 * part of the app. It currently handles deposits only but can be made
 * even more generic when needed (such as for Dashboard Payments section).
 *
 * Usage: <StripePayment type="deposit" />
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reactMixin from 'react-mixin';
import {ReactScriptLoaderMixin} from 'react-script-loader';
import * as BS from 'react-bootstrap';
import Loader from './Loader';
import Validator from 'validator';
import _ from 'underscore';
import SubmitButton from './SubmitButton';
import * as types from '../constants/ActionTypes';
import * as api from '../actions/api';
import * as actions from '../actions/stripeActions';
import * as services from '../constants/Services';

class StripePayment extends Component {

  state = {
    stripeLoading: true,
    stripeLoadingError: false,
    paymentError: null,
    paymentComplete: false,
    token: null
  }

  componentWillMount() {
    if (this.props.type === 'deposit') {
      this.props.actions.loadStripe();
    }
  }

  componentWillUnmount() {
    this.context.store.dispatch({type: types.STRIPE_PAYMENT_FORM_RESET});
  }

  keypress(statusAction, e) {
    api.setStatus(this.context.store.dispatch, 'modified', statusAction, true);
    this.context.store.dispatch({
      type: types.STRIPE_PAYMENT_FORM_UPDATE,
      name: e.target.name,
      value: e.target.value
    });
  }

  getScriptURL() {
    return 'https://js.stripe.com/v2/';
  }

  onScriptLoaded() {
    let Stripe = window.Stripe;
    Stripe.setPublishableKey(services.STRIPE_KEY);
    this.setState({ stripeLoading: false, stripeLoadingError: false });
    if (this.props.stripeLoaded) this.props.stripeLoaded();
  }

  onScriptError() {
    this.setState({ stripeLoading: false, stripeLoadingError: true });
  }

  showStripeStatus(){
    let store = this.props.appState;
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

  getHeadingText() {
    let text = '';
    switch (this.props.type) {
      case 'deposit': {
        text = 'Post with a Card';
        break;
      }
      case 'setup': {
        text = 'Setup a new Card';
        break;
      }
    }
    return text;
  }

  getSubmitButtonText(state) {
    let text = '';
    switch (state) {
      case 'loading': {
        text = this.props.type === 'setup' ? 'Adding' : 'Submitting';
        break;
      }
      case 'modified': {
        switch (this.props.type) {
          case 'deposit': {
            text = 'Submit Deposit';
            break;
          }
          case 'setup': {
            text = 'Add Credit Card';
            break;
          }
        }
        break;
      }
      case 'setup': {
        text = 'Add Credit Card';
        break;
      }
      default: {
        switch (this.props.type) {
          case 'deposit': {
            text = 'Submit Deposit';
            break;
          }
          case 'setup': {
            text = 'Add Credit Card';
            break;
          }
        }
      }
    }
    return text;
  }

  submit(e) {
    e.preventDefault();

    let store = this.props.appState;
    let amountRequired = this.props.type === 'deposit';

    if (amountRequired && store.stripeAmount == null) {
      this.setState({ paymentError: 'Amount is required.' });
      return;
    }

    api.setStatus(this.context.store.dispatch, 'saving', 'stripeForm', true);
    let Stripe = window.Stripe;

    let self = this;
    this.setState({ paymentError: null });

    let userId = self.context.store.getState().loginAppState.userInfo.id;

    let stripeAmount = store.stripeAmount;
    if (amountRequired) {
      // remove $ and ,
      stripeAmount = parseFloat(stripeAmount.toString().trim().replace(/\$|,/g, ''));

      // apply 4% transaction fee and convert to pennies, rounded to the nearest cent
      stripeAmount = (stripeAmount * 1.04);
      stripeAmount = Math.round(stripeAmount * 100);
    }

    if (self.props.type === 'deposit' && store.stripeCardExists) {
      let payload = {
        "amount": stripeAmount,
        "currency":"usd",
        "description":"stripe security deposit",
        "remember_customer":"true",
        "paymentType":"TT_PAY_F2R_SEC_DEPOSIT"
      };
      self.props.actions.saveStripeDeposit(payload, userId, balance => {
        self.setState({ paymentComplete: true });
        api.setStatus(self.context.store.dispatch, 'loading', 'stripeForm', false);
        api.setStatus(self.context.store.dispatch, 'modified', 'stripeForm', false);
        api.setStatus(self.context.store.dispatch, 'saving', 'stripeForm', false);
        self.props.callback(balance);
      });
      return;
    }

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
      } else {
        if (self.props.type === 'deposit' && !store.stripeAcctExists) {
          let payload = {
            "amount": stripeAmount,
            "currency":"usd",
            "description":"stripe security deposit",
            "one_time_use_token": response.id,
            "remember_customer":"true",
            "paymentType":"TT_PAY_F2R_SEC_DEPOSIT"
          };
          self.props.actions.saveStripeDeposit(payload, userId, balance => {
            self.setState({ paymentComplete: true, token: response.id });
            api.setStatus(self.context.store.dispatch, 'loading', 'stripeForm', false);
            api.setStatus(self.context.store.dispatch, 'modified', 'stripeForm', false);
            api.setStatus(self.context.store.dispatch, 'saving', 'stripeForm', false);
            self.props.callback(balance);
          });
        } else if (self.props.type === 'deposit' && !store.stripeCardExists) {
          let payload = { "token": response.id };
          self.props.actions.saveStripeCard(payload, () => {
            let payloadDeposit = {
              "amount": stripeAmount,
              "currency":"usd",
              "description":"stripe security deposit",
              "remember_customer":"true",
              "paymentType":"TT_PAY_F2R_SEC_DEPOSIT"
            };
            self.props.actions.saveStripeDeposit(payloadDeposit, userId, balance => {
              self.setState({ paymentComplete: true, token: response.id });
              api.setStatus(self.context.store.dispatch, 'loading', 'stripeForm', false);
              api.setStatus(self.context.store.dispatch, 'modified', 'stripeForm', false);
              api.setStatus(self.context.store.dispatch, 'saving', 'stripeForm', false);
              self.props.callback(balance);
            });
          });
        } else if (self.props.type === 'setup') {
          let payload = { "token": response.id };
          self.props.actions.saveStripeCard(payload, () => {
            api.setStatus(self.context.store.dispatch, 'loading', 'stripeForm', false);
            api.setStatus(self.context.store.dispatch, 'modified', 'stripeForm', false);
            api.setStatus(self.context.store.dispatch, 'saving', 'stripeForm', false);
            self.props.callback();
          });
        } else {
          if (self.props.callback) self.props.callback();
        }
      }
    });
  }

  render() {

    let store = this.props.appState;

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="stripeForm">
        <div className="stripe-payment-container clearfix">

          <div className="section">{this.getHeadingText()}</div>

          <form>
            <BS.FormGroup controlId="stripe">
              {this.props.type === 'deposit' && (
                <div className="row">
                  <div className="item amount">
                    <BS.ControlLabel>Amount (USD $)</BS.ControlLabel>
                    <BS.InputGroup>
                      <BS.InputGroup.Addon>$</BS.InputGroup.Addon>
                      <BS.FormControl
                      onChange={_.partial(this.keypress.bind(this), 'stripeForm')}
                      data-stripe='amount'
                      placeholder="0.00"
                      value={store.stripeAmount}
                      name="stripeAmount"
                      type="text" />
                    </BS.InputGroup>
                  </div>
                </div>
              )}
              {(!store.stripeAcctExists || !store.stripeCardExists) && (
                <div className="row">
                  <div className="item card-number">
                    <BS.ControlLabel>Card Number</BS.ControlLabel>
                    <BS.FormControl
                    onChange={_.partial(this.keypress.bind(this), 'stripeForm')}
                    data-stripe='number'
                    value={store.stripeNumber}
                    name="stripeNumber"
                    type="text" />
                  </div>
                  <div className="item expiry">
                    <BS.ControlLabel>Month</BS.ControlLabel>
                    <BS.FormControl
                    onChange={_.partial(this.keypress.bind(this), 'stripeForm')}
                    data-stripe='exp-month'
                    placeholder="MM"
                    value={store.stripeExpiryMonth}
                    name="stripeExpiryMonth"
                    type="text" />
                  </div>
                  <div className="item expiry">
                    <BS.ControlLabel>Year</BS.ControlLabel>
                    <BS.FormControl
                    onChange={_.partial(this.keypress.bind(this), 'stripeForm')}
                    data-stripe='exp-year'
                    placeholder="YY"
                    value={store.stripeExpiryYear}
                    name="stripeExpiryYear"
                    type="text" />
                  </div>
                  <div className="item cvc">
                    <BS.ControlLabel>CVC</BS.ControlLabel>
                    <BS.FormControl
                    onChange={_.partial(this.keypress.bind(this), 'stripeForm')}
                    data-stripe='cvc'
                    value={store.stripeCVC}
                    name="stripeCVC"
                    type="text" />
                  </div>
                </div>
              )}
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

          <div className="pull-right">
            {this.props.altButton}
            {' '}
            <SubmitButton
              className="stripe-submit"
              appState={this.props.appState}
              statusAction="stripeForm"
              submit={this.submit.bind(this)}
              textLoading={this.getSubmitButtonText('loading')}
              textModified={this.getSubmitButtonText('modified')}>
              {this.getSubmitButtonText()}
            </SubmitButton>
          </div>

        </div>
      </Loader>
    );
  }

}

reactMixin(StripePayment.prototype, ReactScriptLoaderMixin);

StripePayment.propTypes = {
  type: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
  stripeLoaded: PropTypes.func,
  children: PropTypes.element
};

StripePayment.contextTypes = {
  store: PropTypes.object,
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    appState: state.stripeAppState,
    userState: state.loginAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StripePayment);
