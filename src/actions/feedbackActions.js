import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import 'isomorphic-fetch';

import * as api from './api';

import isEmail from 'validator/lib/isEmail';

export function updateFeedbackForm(settings, name, value) {
  return { type: types.FEEDBACK_FORM_UPDATE, settings, name, value };
}

export function clearFeedbackForm() {
  return { type: types.FEEDBACK_FORM_CLEAR };
}

export function sendFeedbackForm(data, signup, callback) {
  const signupUrl = 'http://fittorent.us12.list-manage.com/subscribe?u=92bd66b3e9f2542c152506f07&id=4519efce7c&group[5093][2]=checked&MERGE0=&MERGE1='+data.prefill.llFirstName+'&MERGE2='+data.prefill.llLastName;

  function getDateOfReview() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const month = today.getMonth()+1;
    const mm = (month < 10) ? '0'+month : month;
    const dd = (today.getDate() < 10) ? '0'+today.getDate() : today.getDate();
    return yyyy+'-'+mm+'-'+dd;
  }

  return function (dispatch) {
    const vettingChecks = [];
    if (data.repeatabilityBackgroundCheck === 'yes') {
      vettingChecks.push('BACKGROUND_CHECK');
    }
    if (data.repeatabilityCreditCheck === 'yes') {
      vettingChecks.push('CREDIT_REPORT');
    }
    if (data.repeatabilityEmploymentVerification === 'yes') {
      vettingChecks.push('EMPLOYMENT_VERIFICATION');
    }

    // Validation checks
    const missing = [];
    if (!data.streetAddress) missing.push('Street Address');
    if (!data.city) missing.push('City');
    if (!data.state) missing.push('State');
    if (!data.zip) missing.push('Zip');
    if (!data.responsibilityMaintainence ||
        !data.responsibilityAlerts ||
        !data.responsibilityAlerts ||
        !data.responsibilityPet ||
        !data.responsibilityComplaints) {
      missing.push('All Responsibility questions');
    }
    if (!data.reliabilitySecurity ||
        !data.reliabilityPay ||
        !data.reliabilityPayFull) {
      missing.push('All Reliability questions');
    }
    if (!data.repeatabilityRentAgain) missing.push("Would you rent again question");
    if (!data.rating) missing.push("Rating");

    if (missing.length) {
      let success = false;
      let message = 'Please fill in the following fields: '+missing.join(', ')+'.';
      dispatch({ type: types.FEEDBACK_FORM_SUBMIT, success, message});
      callback();
      return;
    }

    if (data.contactInfo && !isEmail(data.contactInfo)) {
      let success = false;
      let message = 'Please provide a valid email address.';
      dispatch({ type: types.FEEDBACK_FORM_SUBMIT, success, message});
      callback();
      return;
    }

    const jsonBody = {
      "token": data.token,
      "id": data.prefill.id,
      "ttUserId": data.prefill.ttUserId,
      "ttFirstName": data.prefill.ttFirstName,
      "ttLastName": data.prefill.ttLastName,
      "llFirstName": data.prefill.llFirstName,
      "llLastName": data.prefill.llLastName,
      "address":{
        "firstLineAddress": data.streetAddress,
        "city": data.city,
        "state": data.state,
        "zipCode": data.zip,
        "startDate": data.prefill.beginDate,
        "endDate": data.prefill.endDate
      },
      "email": data.prefill.email,
      "phone": data.prefill.phone,
      "contactInfo": data.contactInfo,
      "maintainProperty": data.responsibilityMaintainence,
      "notifyOfIssues": data.responsibilityAlerts,
      "homeRepairs": data.responsibilityExtra,
      "responsiblePetOwner": data.responsibilityPet,
      "complaints": data.responsibilityComplaints,
      "securityDepositReturned": data.reliabilitySecurity,
      "onTimePayment": data.reliabilityPay,
      "fullPayment": data.reliabilityPayFull,
      "vettingChecks": vettingChecks,
      "rentAgain": data.repeatabilityRentAgain,
      "rating": data.rating,
      "comments": data.thoughts,
      "isF2RVerified": data.prefill.isF2RVerified,
      "beginDate": data.prefill.beginDate,
      "endDate": data.prefill.endDate,
      "dateOfReview": getDateOfReview(),
      "rentAmount": data.prefill.rentAmount ? data.prefill.rentAmount.toString() : data.prefill.rentAmount
    };

    let endpoint = services.TT_FEEDBACK;
    api.setStatus(dispatch, 'loading', 'feedbackSubmit', true);

    if (signup) {
      window.open(signupUrl);
    }

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(jsonBody)
    })
    .then(response => {
      api.setStatus(dispatch, 'loading', 'feedbackSubmit', false);
      if (response.status !== 200){
        let success = false;
        let message = 'Sorry, a system error occurred.';
        dispatch({ type: types.FEEDBACK_FORM_SUBMIT, success, message});
        callback(response);
        return false;
      } else {
        let success = true;
        dispatch({ type: types.FEEDBACK_FORM_SUBMIT, success});
        callback(response);
      }
    })
    .catch(err => {
      if (err) throw new Error(err);
    });
  };
}

export function setCitiesList(stateCode) {
  return function (dispatch) {
    api.get(services.GEO_CITIES+'?state='+stateCode, false, (citiesList) => {
      dispatch({ type: types.FEEDBACK_SET_CITIES_LIST, citiesList});
    });
  };
}

export function decryptToken(token) {
  return function (dispatch) {

    let endpoint = services.TT_DATA + '?token='+encodeURIComponent(token);
    api.setStatus(dispatch, 'loading', 'feedbackPage', true);

    fetch(endpoint, {
      method: 'GET'
    })
    .then(response => {
      if (response.status !== 200){
        dispatch({ type: types.FEEDBACK_DECRYPT_TOKEN, token});
        return false;
      }
      return response.json();
    })
    .then(json => {
      let prefill = json;
      dispatch({ type: types.FEEDBACK_DECRYPT_TOKEN, token, prefill});
      api.get(services.GEO_STATES, false, (statesList) => {
        dispatch({ type: types.FEEDBACK_SET_STATES_LIST, statesList});
        api.setStatus(dispatch, 'loading', 'feedbackPage', false);
      });
    })
    .catch(err => {
      if (err) throw new Error(err);
    });
  };
}
