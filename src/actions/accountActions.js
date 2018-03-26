import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';

import * as api from './api';
import {updateUserInfo} from './loginActions';

export function loadAccountInfo() {
  return function(dispatch, getState){

    //ajax request will be here
    dispatch({
      type: types.ACCOUNT_UPDATE,
      highlights: {
        propOwned: 3,
        tenantsServed: 6,
        paymentsReceived: 12,
        fundsReceived: 26550,
        memberAge: 1.2
      }
    });
  };
}

export function editModeUpdate(panelName, value) {
 return {
   type: types.ACCOUNT_EDIT_MODE,
   panelName,
   value
 };
}

export const loadProfileInfo = () => {
  return (dispatch, getState) => {
    let requestUser = api.getUserDetails(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'profile', true);

    Promise.all([
      requestUser
    ])
    .then((results) => {
      const profile = results[0];

      dispatch({ type: types.PROFILE_LOAD, payload: profile });

      api.setStatus(dispatch, 'loading', 'profile', false);
    });
  };
};

export const saveUserDetails = (payload, callback) => {
  return function (dispatch, getState) {
    api.postUserDetails(dispatch, getState, payload, (response) => {
      dispatch({ type: types.PROFILE_LOAD, payload: response });
      dispatch(updateUserInfo(user => {
        dispatch({type: types.DASHBOARD_USER_SAVE, user});
      }));
      if (callback) callback();
    });
  };
};

export function uploadProfilePic(file) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'uploading', 'profilePicUpload', true);
    api.uploadProfilePic(dispatch, getState, file, () => {
      api.setStatus(dispatch, 'uploading', 'profilePicUpload', false);
      dispatch(updateUserInfo());
    });

  };
}

export function saveAccountLogin(payload, callback) {
  return function (dispatch, getState) {
    api.postUserLoginUpdate(dispatch, getState, payload, (response) => {
      if (response.status !== 200) {
        dispatch({type: types.LOGIN_FORM_UPDATE, success: false, error: response.message});
        if (callback) callback();
        return;
      }

      dispatch({type: types.LOGIN_FORM_UPDATE, success: true, error: null});
      if (callback) callback();
    });
  };
}
