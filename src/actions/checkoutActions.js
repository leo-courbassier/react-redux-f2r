import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import _ from 'underscore';

import * as api from './api';

export function checkoutAction(status) {
  return false;
}

export function updateCheckoutForm(settings, name, value) {
  return { type: types.CHECKOUT_FORM_UPDATE, settings, name, value };
}

export function clearCheckoutForm() {
  return { type: types.CHECKOUT_FORM_CLEAR };
}

export function loadCheckout() {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'loading', 'checkoutPage', true);

    let requestCatalog = api.getECatalog(dispatch, getState);
    let requestAccts = api.getPaymentAccts(dispatch, getState);
    let requestUserDetails = api.getUserDetails(dispatch, getState);

    Promise.all([
      requestCatalog,
      requestAccts,
      requestUserDetails
      ])
    .then((results) => {
      let catalog = results[0];
      let accts = results[1];
      let userDetails = results[2];

      let hasGuarantor = userDetails.userDetails.ttHasGuarantor;

      api.setStatus(dispatch, 'loading', 'checkoutPage', false);
      dispatch({ type: types.CHECKOUT_LOAD, catalog, accts, hasGuarantor });
    });
  };
}

export function checkDiscountCode(price, code) {
  return function (dispatch, getState) {
    let success;
    let error;
    if (!code) {
      success = false;
      error = 'You did not enter a discount code.';
      dispatch({ type: types.CHECKOUT_APPLY_DISCOUNT, price, oldPrice: price, success, error });
      return;
    }
    api.setStatus(dispatch, 'loading', 'discountSubmit', true);
    api.getECalculateDiscount(dispatch, getState, price, code, (newPrice) => {
      if (typeof newPrice !== 'number') {
        success = false;
        error = 'Invalid discount code.';
        dispatch({ type: types.CHECKOUT_APPLY_DISCOUNT, price, oldPrice: price, success, error });
      } else {
        success = true;
        dispatch({ type: types.CHECKOUT_APPLY_DISCOUNT, price: newPrice, oldPrice: price, success });
      }
      api.setStatus(dispatch, 'loading', 'discountSubmit', false);
    });
  };
}

export function removeService(id, price) {
  return function (dispatch) {
    dispatch({ type: types.CHECKOUT_REMOVE_SERVICE, id, price });
  };
}

export function sendPayment(payload, callback) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'loading', 'checkoutSubmit', true);
    api.postETTCheckout(dispatch, getState, payload.productIds.join(','), payload.discountCode || '', payload.one_time_use_token || '', (response) => {
      api.setStatus(dispatch, 'loading', 'checkoutSubmit', false);
      let success;
      let message;
      if (response.status == "SUCCEEDED"){
        success = true;
        dispatch({type: types.CHECKOUT_FINISH, success});
        if (callback) callback(success);
      } else {
        success = false;
        message = response.message;
        dispatch({type: types.CHECKOUT_FINISH, success, message});
        if (callback) callback(success, message);
      }
    });
  };
}
