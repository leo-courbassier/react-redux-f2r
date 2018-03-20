import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';

import * as api from './api';

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
  }
}

export function editModeUpdate(panelName, value) {
 return {
   type: types.ACCOUNT_EDIT_MODE,
   panelName,
   value
 }
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
