import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';

import * as api from './api';


export function updateSignupForm(settings, name, value) {
  return { type: types.SIGNUP_FORM_UPDATE, settings, name, value };
}

export function clearSignupForm() {
  return { type: types.SIGNUP_FORM_CLEAR };
}

export function signup(firstName, lastName, user, password, acceptTerms,userType) {
  return function (dispatch) {
    debugger
    let auth = btoa(user + ':' + password);
    let endpoint = services.USER_SIGNUP;
    api.setStatus(dispatch, 'loading', 'signupSubmit', true);
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        'firstName': firstName,
        'lastName': lastName,
        'email': user,
        'password': password,
        'isAcceptTos': acceptTerms,
        'userType': userType || '0'
      })
    })
    .then(response => {
      return (response.json());
    })
    .then(json => {
      api.setStatus(dispatch, 'loading', 'signupSubmit', false);
      let success = false;
      if (json.email === user && json.userType==='RENTER'){
        success = true;
        let authorized = true;
        dispatch({ type: types.USER_LOGIN, authorized, auth, json });
        browserHistory.push('/onboarding');
        let header = `Basic ${auth}`;
        api.checkInvites(dispatch, header);
      }else if(json.email === user && json.userType==='LANDLORD'){

        success = true;
        let authorized = true;
        dispatch({ type: types.USER_LOGIN, authorized, auth, json });
        browserHistory.push('/onboardinglandlord');
        let header = `Basic ${auth}`;
        api.checkInvites(dispatch, header);

      }else{
        let error = json.message;
        dispatch({ type: types.SIGNUP_FORM_SUCCESS, success, error });
      }
    })
    .catch(err => {
      throw new Error(err);
    });
  };
}
