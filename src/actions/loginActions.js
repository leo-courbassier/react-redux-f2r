import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';

import * as api from './api';


export function updateLoginForm(settings, name, value) {
  return { type: types.LOGIN_FORM_UPDATE, settings, name, value };
}

export function clearLoginForm() {
  return { type: types.LOGIN_FORM_CLEAR };
}

export function login(user, password) {
  return function (dispatch, getState) {

    let auth = btoa(user + ':' + password);

    api.setStatus(dispatch, 'loading', 'loginSubmit', true);

    api.getLogin(dispatch, getState, "Basic " + auth, (json) =>{
      api.setStatus(dispatch, 'loading', 'loginSubmit', false);
      let authorized = false;
      if (json.status !== 401 && (json.userType === 'LANDLORD')){
        authorized = true;
      }else{
        auth = null;
      }

      dispatch({ type: types.USER_LOGIN, authorized, auth, json });
      if (authorized == true){
        browserHistory.push('/onboardinglandlord');
      }
    });



  };
}

export function updateUserInfo() {
  return function (dispatch, getState) {

    api.updateUserInfo(dispatch, getState, (json) => {
      let user = json;
      dispatch({ type: types.UPDATE_USER_INFO, user });
    });

  };
}

export function logout() {
  return function (dispatch) {
    dispatch({ type: types.USER_LOGOUT });
    window.location = '/';
    //browserHistory.push('/');
  };
}
