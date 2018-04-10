import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';

import * as api from './api';
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

    api.setStatus(dispatch, 'loading', 'paymentMethods', true);

    Promise.all([
      requestFundingSources,
      requestCCList,
      requestUserDetails
    ])
    .then(results => {
      let fundingSources = Array.isArray(results[0]) ? results[0] : [];
      let creditCards = Array.isArray(results[1]) ? results[1] : [];
      let userInfo = results[2];

      // check and set default funding source
      for (let i = 0; i < fundingSources.length; i++) {
        let defaultSourceId = userInfo.userDetails.paymentDestinationAccount;
        let currentSourceId = fundingSources[i].id;
        fundingSources[i].isDefault = (defaultSourceId == currentSourceId);
      }

      dispatch({
        type: types.PAYMENTS_METHODS_LOAD,
        fundingSources, creditCards
      });

      api.setStatus(dispatch, 'loading', 'paymentMethods', false);

      if (callback) callback();
    });
  };
}

export function loadPaymentsMethodsForm() {

}
