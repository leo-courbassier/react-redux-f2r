import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';
import _ from 'underscore';

import * as api from './api';
import * as services from '../constants/Services';
import {PAYMENT_HISTORY_PAGE_SIZE} from '../constants/App';
import {updateUserInfo} from './loginActions';

export function editModeUpdate(panelName, value) {
  return {
   type: types.PAYMENTS_EDIT_MODE,
   panelName,
   value
  };
}

export function loadPaymentsMethods(callback) {
  return (dispatch, getState) => {
    let requestFundingSources = api.verifyFundingSources(dispatch, getState);
    let requestCCList = api.getCCList(dispatch, getState);
    let requestUserDetails = api.getUserDetails(dispatch, getState);
    let requestStateList = api.getStateList(dispatch, getState);
    let requestAccts = api.getPaymentAccts(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'paymentMethods', true);

    Promise.all([
      requestFundingSources,
      requestCCList,
      requestUserDetails,
      requestStateList,
      requestAccts
    ])
    .then(results => {
      let fundingSources = Array.isArray(results[0]) ? results[0] : [];
      let creditCards = Array.isArray(results[1]) ? results[1] : [];
      let userInfo = results[2];
      let stateList = results[3];
      let accts = results[4];

      let customerCreated = false;

      // check and set default funding source
      for (let i = 0; i < fundingSources.length; i++) {
        let defaultSourceId = userInfo.userDetails.paymentDestinationAccount;
        let currentSourceId = fundingSources[i].id;
        fundingSources[i].isDefault = (defaultSourceId == currentSourceId);
      }

      // check for dwolla customer existence
      if (fundingSources.length > 0) {
        customerCreated = true;
      } else {
        for (let acct of accts) {
          if (acct === 'DWOLLA') customerCreated = true;
        }
      }

      dispatch({
        type: types.PAYMENTS_METHODS_LOAD,
        fundingSources, creditCards, stateList, customerCreated
      });

      api.setStatus(dispatch, 'loading', 'paymentMethods', false);

      if (callback) callback();
    });
  };
}

export function loadPaymentsMethodsForm() {

}

export function getCityList(stateCode) {
  return (dispatch, getState) => {
    api.setStatus(dispatch, 'loading', 'paymentMethodsCityList', true);
    api.get(services.GEO_CITIES + `?state=${stateCode}`, null, cityList => {
      dispatch({ type: types.PAYMENTS_METHODS_CITIES_UPDATE, cityList });
      api.setStatus(dispatch, 'loading', 'paymentMethodsCityList', false);
    });
  };
}

export function createCustomer(payload, callback) {
  return (dispatch, getState) => {
    return api.postDwollaCustomer(dispatch, getState, payload, response => {
      dispatch({ type: types.PAYMENTS_METHODS_CUSTOMER_CREATED });
      if (callback) callback(response);
    });
  };
}

export function loadFundingSources(callback) {
 return function (dispatch, getState) {
   let requestFundingSources = api.verifyFundingSources(dispatch, getState);
   let requestUserDetails = api.getUserDetails(dispatch, getState);

   api.setStatus(dispatch, 'loading', 'paymentMethodsFundingSources', true);

   Promise.all([
     requestFundingSources,
     requestUserDetails
     ])
   .then(results => {
     let fundingSources = results[0];
     let userInfo = results[1];

     // check and set default funding source
     for (let i = 0; i < fundingSources.length; i++) {
       let defaultSourceId = userInfo.userDetails.paymentDestinationAccount;
       let currentSourceId = fundingSources[i].id;
       fundingSources[i].isDefault = (defaultSourceId == currentSourceId);
     }

     dispatch({
       type: types.PAYMENTS_METHODS_FUNDING_SOURCES_UPDATE,
       fundingSources
     });

     api.setStatus(dispatch, 'loading', 'paymentMethodsFundingSources', false);

     if (callback) callback();
   });
 };
}

export function loadCreditCards(callback) {
 return function (dispatch, getState) {
   let requestCCList = api.getCCList(dispatch, getState);

   api.setStatus(dispatch, 'loading', 'paymentMethodsCreditCards', true);

   Promise.all([
     requestCCList
     ])
   .then(results => {
     let creditCards = results[0];

     dispatch({
       type: types.PAYMENTS_METHODS_CREDIT_CARDS_UPDATE,
       creditCards
     });

     api.setStatus(dispatch, 'loading', 'paymentMethodsCreditCards', false);

     if (callback) callback();
   });
 };
}

export function removeFundingSource(id, callback) {
 return function (dispatch, getState) {
   let fundingSources = getState().paymentsAppState.fundingSources;

   api.setStatus(dispatch, 'loading', 'removeFundingSource', true);

   api.deleteFundingSource(dispatch, getState, id, (response) => {
     if (response.status !== 200) {
       api.setStatus(dispatch, 'loading', 'removeFundingSource', false);

       let success = false;

       dispatch({
         type: types.PAYMENTS_METHODS_REMOVE_FUNDING_SOURCE,
         success
       });

       if (callback) callback(success);

       return;
     }

     let updatedFundingSources = _.reject(fundingSources, source => {
       return source.id === id;
     });

     api.setStatus(dispatch, 'loading', 'removeFundingSource', false);

     let success = true;

     dispatch({
       type: types.PAYMENTS_METHODS_REMOVE_FUNDING_SOURCE,
       success,
       fundingSources: updatedFundingSources
     });

     if (callback) callback(success);
   });
 };
}

export function removeCreditCard(id, callback) {
 return function (dispatch, getState) {
   let creditCards = getState().paymentsAppState.creditCards;

   api.setStatus(dispatch, 'loading', 'removeCreditCard', true);

   api.deleteCreditCard(dispatch, getState, id, (response) => {
     if (response.status !== 200) {
       api.setStatus(dispatch, 'loading', 'removeCreditCard', false);

       let success = false;

       dispatch({
         type: types.PAYMENTS_METHODS_REMOVE_CREDIT_CARD,
         success
       });

       if (callback) callback(success);

       return;
     }

     let updatedCreditCards = _.reject(creditCards, card => {
       return card.id === id;
     });

     api.setStatus(dispatch, 'loading', 'removeCreditCard', false);

     let success = true;

     dispatch({
       type: types.PAYMENTS_METHODS_REMOVE_CREDIT_CARD,
       success,
       creditCards: updatedCreditCards
     });

     if (callback) callback(success);
   });
 };
}

export function setDefaultFundingSource(sourceId, callback) {
 return function (dispatch, getState) {
   let payload = sourceId;

   api.setStatus(dispatch, 'loading', `setFundingSourceDefault${sourceId}`, true);

   api.setDefaultAch(dispatch, getState, payload, () => {
     let fundingSources = getState().paymentsAppState.fundingSources;
     let updatedFundingSources = fundingSources.splice();

     for (let i = 0; i < fundingSources.length; i++) {
       updatedFundingSources[i] = fundingSources[i];
       updatedFundingSources[i].isDefault = (updatedFundingSources[i].id == sourceId);
     }

     dispatch({
       type: types.PAYMENTS_METHODS_FUNDING_SOURCES_UPDATE,
       fundingSources: updatedFundingSources
     });

     api.setStatus(dispatch, 'loading', `setFundingSourceDefault${sourceId}`, false);

     if (callback) callback();
   });
 };
}

export function loadPaymentsMake(callback) {
  return (dispatch, getState) => {
    let requestTenants = api.getLeaseTenants(dispatch, getState);
    let requestFundingSources = api.verifyFundingSources(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'paymentMake', true);

    // TODO: Check getState().paymentsAppState.fundingSources
    //       to see if funding sources already exist.
    //       Or load fundingSources as part of entire Payments page.
    Promise.all([
      requestTenants,
      requestFundingSources
    ])
    .then(([
      tenants,
      fundingSources
    ]) => {
      if (!Array.isArray(fundingSources)) fundingSources = [];

      dispatch({
        type: types.PAYMENTS_MAKE_LOAD,
        tenants, fundingSources
      });

      api.setStatus(dispatch, 'loading', 'paymentMake', false);

      if (callback) callback();
    });
  };
}

export function sendPayment(payload, callback) {
  return (dispatch, getState) => {
    return api.postDwollaPayment(dispatch, getState, payload, (response) => {
      let success = response.status == 'PENDING';
      let message = null;
      if (!success) {
        let dwollaResponse = JSON.parse(response.message);
        let errors = dwollaResponse._embedded && dwollaResponse._embedded.errors;
        if (errors && errors.length > 0) {
          message = errors[0].message;
        }
      }
      dispatch({
        type: types.PAYMENTS_MAKE_SEND_PAYMENT,
        success,
        message
      });
    });
  };
}

export function loadPaymentsRequest(callback) {
  return (dispatch, getState) => {
    let requestTenants = api.getLeaseTenants(dispatch, getState);
    let requestLeases = api.getActiveLeases(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'paymentRequest', true);

    Promise.all([
      requestTenants,
      requestLeases
    ])
    .then(([
      tenants,
      leases
    ]) => {

      dispatch({
        type: types.PAYMENTS_REQUEST_LOAD,
        tenants, leases
      });

      api.setStatus(dispatch, 'loading', 'paymentRequest', false);

      if (callback) callback();
    });
  };
}

export function requestPayment(payload, callback) {
  return (dispatch, getState) => {
    return api.requestPaymentFromTenant(dispatch, getState, payload, (response) => {
      let success = !(typeof response === 'object' && 'status' in response && response.status !== 200);
      let message = success ? null : 'Error sending: ' + response.message;
      dispatch({
        type: types.PAYMENTS_MAKE_REQUEST_PAYMENT,
        success,
        message
      });
    });
  };
}

export function loadPaymentsRecurring(callback) {
  return (dispatch, getState) => {
    let requestRecurring = api.getRecurringPayments(dispatch, getState);
    let requestLeases = api.getActiveLeases(dispatch, getState);
    let requestTenants = api.getLeaseTenants(dispatch, getState);
    let requestFundingSources = api.verifyFundingSources(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'paymentRecurring', true);

    Promise.all([
      requestRecurring,
      requestLeases,
      requestTenants,
      requestFundingSources
    ])
    .then(([
      recurring,
      leases,
      tenants,
      fundingSources
    ]) => {

      dispatch({
        type: types.PAYMENTS_RECURRING_LOAD,
        recurring, leases, tenants, fundingSources
      });

      api.setStatus(dispatch, 'loading', 'paymentRecurring', false);

      if (callback) callback();
    });
  };
}

export function removeRecurringPayment(id, callback) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'loading', 'removeRecurring', true);
    api.deleteRecurringPayment(dispatch, getState, id, response => {
      let recurringPayments = getState().paymentsAppState.recurring;

      if (response.status !== 200) {
        api.setStatus(dispatch, 'loading', 'removeRecurring', false);

        let success = false;

        dispatch({
          type: types.PAYMENTS_REMOVE_RECURRING,
          success
        });

        if (callback) callback(success);

        return;
      }

      let updatedRecurringPayments = _.reject(recurringPayments, payment => {
        return payment.id === id;
      });

      api.setStatus(dispatch, 'loading', 'removeRecurring', false);

      let success = true;

      dispatch({
        type: types.PAYMENTS_REMOVE_RECURRING,
        success,
        recurring: updatedRecurringPayments
      });

      if (callback) callback(success);
    });
  };
}

export function loadPaymentsHistory(page = 0, statusAction = 'paymentHistory', callback) {
 return function (dispatch, getState) {
   let history = getState().paymentsAppState.history;

   // If the page data already exists, simply switch to that page
   if (history[page]) {
     dispatch({
       type: types.PAYMENTS_HISTORY_LOAD,
       page
     });

     if (callback) callback(history[page]);

     return;
   }

   let requestPaymentHistory = api.getPaymentHistory(dispatch, getState, page, PAYMENT_HISTORY_PAGE_SIZE);

   api.setStatus(dispatch, 'loading', statusAction, true);

   Promise.all([
     requestPaymentHistory
     ])
   .then(results => {
     let newHistory = results[0];
     let data = null;

     if (Array.isArray(newHistory) && newHistory.length) {
       data = {
         items: newHistory
       };
     }

     api.setStatus(dispatch, 'loading', statusAction, false);

     dispatch({
       type: types.PAYMENTS_HISTORY_LOAD,
       data,
       page
     });

     if (callback) callback();
   });
 };
}
