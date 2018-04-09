import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import _ from 'underscore';

import * as api from './api';

export function loadStripe(callback) {
  return function (dispatch, getState) {
    let requestAccts = api.getPaymentAccts(dispatch, getState);
    let requestCCList = api.getCCList(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'stripeForm', true);

    Promise.all([
      requestAccts,
      requestCCList
      ])
    .then(results => {
      let accts = results[0];
      let creditCards = results[1];

      let stripeAcctExists = false;
      let stripeCardExists = false;

      for (let acct of accts) {
        if (acct.indexOf('STRIPE') !== -1) stripeAcctExists = true;
      }

      if (Array.isArray(creditCards) && creditCards.length) {
        stripeCardExists = true;
      }

      dispatch({type: types.STRIPE_PAYMENT_LOAD, stripeAcctExists, stripeCardExists});

      api.setStatus(dispatch, 'loading', 'stripeForm', false);
    });
  };
}

export function saveStripeDeposit(payload, id, callback) {
  return function (dispatch, getState) {
    api.postStripe(dispatch, getState, payload, (response) => {
      api.getUserDetails(dispatch, getState, (user) => {
        if (response.status == "SUCCEEDED"){
          let stripeAmount = Math.round(payload.amount / 100 / 1.04);
          let amount = {"id": id, "userDetails": {"ttSecurityDeposit": user.userDetails.ttSecurityDeposit + stripeAmount}};
          api.postUserDetails(dispatch, getState, amount, () => {
            if (callback) callback(user.userDetails.ttSecurityDeposit + stripeAmount);
          });
        }
        let message = response.message;
        dispatch({type: types.STRIPE_PAYMENT_TRANSACTION_STATUS, message});
        dispatch({type: types.STRIPE_PAYMENT_FORM_UPDATE, name: 'saved', value: true});
      });
    });
  };
}

export function saveStripeCard(payload, callback) {
  return function (dispatch, getState) {
    api.addCreditCard(dispatch, getState, payload, (response) => {
      dispatch({type: types.STRIPE_PAYMENT_FORM_UPDATE, name: 'saved', value: true});
      if (callback) callback();
    });
  };
}
