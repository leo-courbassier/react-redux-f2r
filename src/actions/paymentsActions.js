import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';
import _ from 'underscore';

import * as api from './api';
import * as services from '../constants/Services';
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
