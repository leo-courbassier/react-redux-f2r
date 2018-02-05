import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import 'isomorphic-fetch';

import * as api from './api';

import isEmail from 'validator/lib/isEmail';

export function updateVerifyForm(settings, name, value) {
  return { type: types.VERIFY_FORM_UPDATE, settings, name, value };
}

export function clearVerifyForm() {
  return { type: types.VERIFY_FORM_CLEAR };
}

export function sendVerifyForm(data) {
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
    if (data.backgroundCheck === 'yes') {
      vettingChecks.push('BACKGROUND_CHECK');
    }
    if (data.creditCheck === 'yes') {
      vettingChecks.push('CREDIT_REPORT');
    }
    if (data.employmentVerification === 'yes') {
      vettingChecks.push('EMPLOYMENT_VERIFICATION');
    }
    if (data.drugScreening === 'yes') {
      vettingChecks.push('DRUG_SCREEN');
    }

    // Validation checks
    const missing = [];
    if (!data.employment) missing.push('Employment');
    if (!data.salary) missing.push('Salary');

    if (missing.length) {
      let success = false;
      let message = 'Please fill in the following fields: '+missing.join(', ')+'.';
      dispatch({ type: types.VERIFY_FORM_SUBMIT, success, message});
      return;
    }

    if (data.contactInfo && !isEmail(data.contactInfo)) {
      let success = false;
      let message = 'Please provide a valid email address.';
      dispatch({ type: types.VERIFY_FORM_SUBMIT, success, message});
      return;
    }

    const jsonBody = {
      "token": data.token,
      "id": data.prefill.id,
      "userId": data.prefill.userId,
      "firstName": data.prefill.firstName,
      "lastName": data.prefill.lastName,
      "position": data.prefill.position,
      "salary": data.prefill.salary,
      "companyName": data.prefill.companyName,
      "companyWebsite": data.prefill.companyWebsite,
      "companyAddress": data.prefill.companyAddress,
      "companyCity": data.prefill.companyCity,
      "companyState": data.prefill.companyState,
      "companyZipCode": data.prefill.companyZipCode,
      "startDate": data.prefill.startDate,
      "endDate": data.prefill.endDate,
      "isF2RCorporatePartner": false,
      "f2rCorporatePartnerId": -1,
      "verifierFirstName": data.prefill.verifierFirstName,
      "verifierLastName": data.prefill.verifierLastName,
      "verifierEmail": data.prefill.verifierEmail,
      "verifierLinkedinUrl": data.linkedin,
      "verifierPhone": data.prefill.verifierPhone,
      "confirmEmployment": data.employment,
      "confirmSalary": data.salary,
      "vettingChecks": vettingChecks,
      "isF2RVerified": data.prefill.isF2RVerified,
      "contactInfo": data.contactInfo,
      "dateOfReview": getDateOfReview()
    };

    let endpoint = services.VERIFY_CONFIRM;
    api.setStatus(dispatch, 'loading', 'verifySubmit', true);

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(jsonBody)
    })
    .then(response => {
      api.setStatus(dispatch, 'loading', 'verifySubmit', false);
      if (response.status !== 200){
        let success = false;
        let message = 'Sorry, a system error occurred.';
        dispatch({ type: types.VERIFY_FORM_SUBMIT, success, message});
        return false;
      } else {
        let success = true;
        dispatch({ type: types.VERIFY_FORM_SUBMIT, success});
      }
    })
    .catch(err => {
      if (err) throw new Error(err);
    });
  };
}

export function decryptToken(token) {
  return function (dispatch) {

    let endpoint = services.VERIFY_DATA + '?token='+encodeURIComponent(token);
    api.setStatus(dispatch, 'loading', 'verifyPage', true);

    fetch(endpoint, {
      method: 'GET'
    })
    .then(response => {
      if (response.status !== 200){
        dispatch({ type: types.VERIFY_DECRYPT_TOKEN, token});
        return false;
      }
      return response.json();
    })
    .then(json => {
      let prefill = json;
      dispatch({ type: types.VERIFY_DECRYPT_TOKEN, token, prefill});
      api.setStatus(dispatch, 'loading', 'verifyPage', false);
    })
    .catch(err => {
      if (err) throw new Error(err);
    });
  };
}
