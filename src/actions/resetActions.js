import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';

import * as api from './api';

import * as loginActions from '../actions/loginActions';



export function updateResetForm(settings, name, value) {
  return { type: types.RESET_FORM_UPDATE, settings, name, value };
}

export function clearResetForm() {
  return { type: types.RESET_FORM_CLEAR };
}

export function reset(newPwd, confirmNewPwd, token) {
  return function (dispatch) {

    let endpoint = services.USER_UPDATE;
    api.setStatus(dispatch, 'loading', 'resetSubmit', true);

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        'newPwd': newPwd,
        'confirmNewPwd': confirmNewPwd,
        'token': token,
        'forgotten': true
      })
    })
    .then(response => {
      let success;
      let message;
      if (response.status !== 200){
        success = false;
        message = response.message;
        dispatch({ type: types.RESET_FORM_SUCCESS, success, message });
      } else {
        success = true;
        dispatch({ type: types.RESET_FORM_SUCCESS, success });
      }

      api.setStatus(dispatch, 'loading', 'resetSubmit', false);
    })
    .catch(err => {
      throw new Error(err);
    });
  };
}
