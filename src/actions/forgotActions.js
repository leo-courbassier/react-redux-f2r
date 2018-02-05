import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';

import * as api from './api';



export function updateForgotForm(settings, name, value) {
  return { type: types.FORGOT_FORM_UPDATE, settings, name, value };
}

export function clearForgotForm() {
  return { type: types.FORGOT_FORM_CLEAR };
}

export function forgot(email) {
  return function (dispatch) {

    let endpoint = services.USER_GETURL + '?email=' + email;
    api.setStatus(dispatch, 'loading', 'forgotSubmit', true);

    fetch(endpoint, {
      method: 'GET'
    })
    .then(response => {
      if (response.status !== 200){
        return (response.json());
      }else{
        return false;
      }
    })
    .then(json => {


      let success = false;
      if (json.status === 500){
        let message = json.message;
        dispatch({ type: types.FORGOT_FORM_SUCCESS, success, message });
      }else{
        let success = true;
        let message = 'An email has been sent with instructions to reset your password.';
        dispatch({ type: types.FORGOT_FORM_SUCCESS, success, message });
      }
      api.setStatus(dispatch, 'loading', 'forgotSubmit', false);

    })
    .catch(err => {
      throw new Error(err);
    });
  };
}
