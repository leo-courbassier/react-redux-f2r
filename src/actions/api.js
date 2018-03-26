import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';

import {logout} from './loginActions';


export function get(endpoint, authHeader, callback){
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': authHeader ? authHeader : '',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
  .then(response => {
    if(response){
      return (response.json());
    }else{
      return false;
    }
  })
  .then(json => {
    if(callback){
      callback(json);
    }
    return json;
  })
  .catch(err => {
    throw new Error(err);
  });
}

export function getText(endpoint, authHeader, callback){
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': authHeader ? authHeader : '',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
  .then(response => {
    if(response){
      return (response.text());
    }else{
      return false;
    }
  })
  .then(text => {
    if(callback){
      callback(text);
    }
    return text;
  })
  .catch(err => {
    throw new Error(err);
  });
}

export function post(endpoint, authHeader, payload, callback, textCallback){
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': authHeader ? authHeader : '',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if(response){
      // be able to accept non-json callbacks
      if(textCallback) response.text().then(textCallback);

      if(!textCallback && response.headers.get("content-type") == 'application/json;charset=UTF-8'){
        return response.json();
      }else{
        return false;
      }
    }else{
      return false;
    }
  })
  .then(json => {
    if(callback){
      callback(json);
    }
    return json;
  })
  .catch(err => {
    throw new Error(err);
  });
}

export function put(endpoint, authHeader, callback){
  return fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Authorization': authHeader ? authHeader : ''
    }
  })
  .then(response => {
    if(response){
      if(response.headers.get("content-type") == 'application/json;charset=UTF-8'){
        return response.json();
      }else{
        return false;
      }
    }else{
      return false;
    }
  })
  .then(json => {
    if(callback){
      callback(json);
    }
    return json;
  })
  .catch(err => {
    throw new Error(err);
  });
}

export function putQueryString(endpoint, authHeader, queryString, callback){
  return fetch(endpoint + queryString, {
    method: 'PUT',
    headers: {
      'Authorization': authHeader ? authHeader : ''
    }
  })
  .then(response => {
    if(response){
      if(response.headers.get("content-type") == 'application/json;charset=UTF-8'){
        return response.json();
      }else{
        return false;
      }
    }else{
      return false;
    }
  })
  .then(json => {
    if(callback){
      callback(json);
    }
    return json;
  })
  .catch(err => {
    throw new Error(err);
  });
}

export function postFormData(endpoint, authHeader, file, callback){
  let fd = new FormData();
  fd.append('file', file);

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': authHeader ? authHeader : ''
    },
    body: fd
  })
  .then(response =>{
    if(callback){
      callback(response);
    }
    return false;
  })
  .catch(err => {
    throw new Error(err);
  });

}


export function del(endpoint, authHeader, callback){
  return fetch(endpoint, {
    method: 'DELETE',
    headers: {'Authorization': authHeader ? authHeader : ''}
  })
  .then(response => {
    if(response){
      if(typeof response == 'object'){
        if(callback){
          callback(response);
          return false;
        }else{
          return false;
        }
      }
    }else{
      return false;
    }
  })
  .catch(err => {
    throw new Error(err);
  });
}

export function setStatus(dispatch, statusType, statusAction, statusState) {
  dispatch({ type: types.STATUS_UPDATE, statusType, statusAction, statusState });
}

export function clearModified(dispatch) {
  dispatch({ type: types.ONBOARDING_CLEAR_MODIFIED });
}

export function getAuthHeaders(dispatch, getState) {
  let state = getState();
  let auth = state.loginAppState.auth;
  if (auth !== null){
    let header = `Basic ${auth}`;
    return header;
  }else{
    dispatch(logout());
  }
}



/////


export function getStateList(dispatch, getState) {
  let authHeader = getAuthHeaders(dispatch, getState);
  return get(services.GEO_STATES, authHeader);
}


export function getCityList(dispatch, getState, stateCode, statusAction) {
  let authHeader = getAuthHeaders(dispatch, getState);
  if (stateCode == null || stateCode == '' || stateCode == undefined){
    return false;
  }
  setStatus(dispatch, 'loading', statusAction, true);
  return get(services.GEO_CITIES + `?state=${stateCode}`, authHeader, (json) =>{
    let cityList = json;
    dispatch({ type: types.CITIES_UPDATE, statusAction, cityList });
    setStatus(dispatch, 'loading', statusAction, false);
  });
}

export function getLogin(dispatch, getState, auth, callback) {
  return get(services.USER_USER, auth, callback);
}

export function updateUserInfo(dispatch, getState, callback) {
  return get(services.USER_USER, getAuthHeaders(dispatch, getState), callback);
}

export function getUserDetails(dispatch, getState, callback) {
  return get(services.USER_USER_DETAILS, getAuthHeaders(dispatch, getState), callback);
}

export function getPets(dispatch, getState) {
  return get(services.TT_PETS, getAuthHeaders(dispatch, getState));
}

export function getLinkedAccounts(dispatch, getState) {
  return get(services.TT_LINKEDACCOUNTS, getAuthHeaders(dispatch, getState));
}

export function getFacebookAuthorizeUrl(dispatch, getState, callback){
  return get(services.FACEBOOK_AUTHORIZEURL, getAuthHeaders(dispatch, getState), callback);
}

export function getLinkedinAuthorizeUrl(dispatch, getState, callback) {
  return get(services.LINKEDIN_AUTHORIZEURL, getAuthHeaders(dispatch, getState, callback));
}

export function getFacebookToken(dispatch, getState, callback){
  return getText(services.FACEBOOK_TOKEN, getAuthHeaders(dispatch, getState), callback);
}

export function getLinkedinToken(dispatch, getState, callback) {
  return getText(services.LINKEDIN_TOKEN, getAuthHeaders(dispatch, getState), callback);
}

export function getIncomeSources(dispatch, getState) {
  return get(services.TT_AI, getAuthHeaders(dispatch, getState));
}

export function getAddresses(dispatch, getState) {
  return get(services.TT_ADDRESSES, getAuthHeaders(dispatch, getState));
}

export function getPaymentAccts(dispatch, getState) {
  return get(services.PAYMENT_ACCTS, getAuthHeaders(dispatch, getState));
}

export function getECatalog(dispatch, getState) {
  return get(services.E_CATALOG, getAuthHeaders(dispatch, getState));
}

export function getECalculateDiscount(dispatch, getState, price, code, callback) {
  return get(services.E_CALCULATE_DISCOUNT + '?price='+price+'&code='+code, getAuthHeaders(dispatch, getState), callback);
}

export function postETTCheckout(dispatch, getState, productIds, discountCode, token, callback) {
  return putQueryString(services.E_TT_CHECKOUT, getAuthHeaders(dispatch, getState), '?productIds='+productIds+'&discountCode='+discountCode+'&token='+token, callback);
}

export function postUserDetails(dispatch, getState, payload, callback){
  return post(services.USER_UPDATE_USER, getAuthHeaders(dispatch, getState), payload, callback);
}

export function postUserLoginUpdate(dispatch, getState, payload, callback){
  return post(services.USER_UPDATE, getAuthHeaders(dispatch, getState), payload, callback);
}

export function postStepOne(dispatch, getState, payload, callback){
  return post(services.TT_STEP1, getAuthHeaders(dispatch, getState), payload, callback);
}

export function uploadProfilePic(dispatch, getState, file, callback){
  return postFormData(services.USER_PROFILE_PIC, getAuthHeaders(dispatch, getState), file, callback);
}

export function postStepTwo(dispatch, getState, payload, callback){
  return post(services.TT_STEP2, getAuthHeaders(dispatch, getState), payload, callback);
}

export function postAddTenant(dispatch, getState, payload, callback){
  return post(services.ADD_TENANT, getAuthHeaders(dispatch, getState), payload, callback);
}

export function postStepThree(dispatch, getState, payload, callback){
  return post(services.TT_STEP3, getAuthHeaders(dispatch, getState), payload, callback);
}

export function postStepSix(dispatch, getState, payload, callback){
  return post(services.TT_STEP6, getAuthHeaders(dispatch, getState), payload, callback);
}

export function getMandates(dispatch, getState, callback){
  return get(services.TT_MANDATES, getAuthHeaders(dispatch, getState), callback);
}

export function addRentMandate(dispatch, getState, payload, callback){
  return post(services.TT_ADDRENTMANDATE, getAuthHeaders(dispatch, getState), payload, callback);
}

export function addFamily(dispatch, getState, payload, callback){
  return post(services.TT_ADDFAMILY, getAuthHeaders(dispatch, getState), payload, callback);
}

export function inviteRoommate(dispatch, getState, queryString, callback){
  return putQueryString(services.TT_INVITEROOMMATE, getAuthHeaders(dispatch, getState), queryString, callback);
}

export function getEmployerVerification(dispatch, getState){
  return get(services.VERIFY_VERIFICATION, getAuthHeaders(dispatch, getState));
}

export function getPropertyList(dispatch, getState){
  return get(services.GET_PROPERTY_LIST, getAuthHeaders(dispatch, getState));
}


export function postEmployerVerification(dispatch, getState, payload, callback, textCallback){
  return post(services.VERIFY_REQUESTVERIFY, getAuthHeaders(dispatch, getState), payload, callback, textCallback);
}

export function getLandlordFeedback(dispatch, getState){
  return get(services.TT_LL_FEEDBACK, getAuthHeaders(dispatch, getState));
}

export function postLandlordFeedback(dispatch, getState, payload, callback, textCallback){
  return post(services.TT_REQUESTFEEDBACK, getAuthHeaders(dispatch, getState), payload, callback, textCallback);
}

export function uploadIncomeDoc(dispatch, getState, file, callback){
  return postFormData(services.DEPOT_UPLOAD, getAuthHeaders(dispatch, getState), file, callback);
}

export function uploadCreditReport(dispatch, getState, file, callback){
  return postFormData(services.DEPOT_UPLOADCR, getAuthHeaders(dispatch, getState), file, callback);
}

export function uploadSupportingDoc(dispatch, getState, file, callback){
  return postFormData(services.DEPOT_UPLOAD, getAuthHeaders(dispatch, getState), file, callback);
}

export function postStripe(dispatch, getState, payload, callback){
  return post(services.PAYMENT_CCADHOC, getAuthHeaders(dispatch, getState), payload, callback);
}

export function postGuarantor(dispatch, getState, payload, callback){
  return post(services.GR_VERIFY, getAuthHeaders(dispatch, getState), payload, callback);
}

export function verifyFundingSources(dispatch, getState, callback){
  return get(services.PAYMENT_ACHFS, getAuthHeaders(dispatch, getState), callback);
}

export function postDwollaPayment(dispatch, getState, payload, callback){
  return post(services.PAYMENT_ACHADHOC, getAuthHeaders(dispatch, getState), payload, callback);
}

export function postDwollaCustomer(dispatch, getState, payload, callback){
  return post(services.DWOLLA_IAV_CREATECUSTOMER, getAuthHeaders(dispatch, getState), payload, callback);
}

export function getDwollaToken(dispatch, getState, callback){
  return get(services.DWOLLA_IAV_TOKEN, getAuthHeaders(dispatch, getState), callback);
}

export function checkInvites(dispatch, auth, callback){
  return put(services.TT_CHECKINVITES, auth, callback);
}

export function getScore(dispatch, getState, callback){
  return put(services.TT_F2RSCORE, getAuthHeaders(dispatch, getState), callback);
}

export function getPseudoScore(dispatch, getState, callback){
  return put(services.TT_PSEUDO_F2RSCORE, getAuthHeaders(dispatch, getState), callback);
}
