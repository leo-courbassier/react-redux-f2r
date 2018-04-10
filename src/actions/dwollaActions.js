import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import _ from 'underscore';
import * as api from './api';
import {logout, updateUserInfo} from './loginActions';

export function loadDwolla(setup = false){
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'loading', 'dwollaForm', true);
    api.verifyFundingSources(dispatch, getState, (json) => {
      let accounts = json;
      dispatch({type: types.DWOLLA_PAYMENT_LOAD_ACCOUNT_LIST, accounts});
      let verified = (json.length != 0);
      dispatch({type: types.DWOLLA_PAYMENT_VERIFIED_STATUS, verified});
      if(!verified || setup){
        api.getDwollaToken(dispatch, getState, (json) => {
          let token = json.token;
          dispatch({type: types.DWOLLA_PAYMENT_TOKEN, token});
          api.setStatus(dispatch, 'loading', 'dwollaForm', false);
        });
      }else{
        api.setStatus(dispatch, 'loading', 'dwollaForm', false);
      }
    });
  };
}

export function saveDwollaDeposit(payload, id, callback) {
  return function (dispatch, getState) {

    api.postDwollaPayment(dispatch, getState, payload, (response) => {
      api.getUserDetails(dispatch, getState, (user) => {
        api.setStatus(dispatch, 'saving', 'dwollaForm', false);
        api.setStatus(dispatch, 'modified', 'dwollaForm', false);
        if (response.status == "PENDING"){
          let secDepositAmount = user.userDetails.ttSecurityDeposit ? parseFloat(user.userDetails.ttSecurityDeposit) : 0;
          let dwollaValue = payload.value ? parseFloat(payload.value) : 0;
          let amount = {"id": id, "userDetails": {"ttSecurityDeposit": secDepositAmount + dwollaValue}};
          api.postUserDetails(dispatch, getState, amount, () => {
            if (callback) callback(secDepositAmount + dwollaValue);
          });
        }
        let message = response.message;
        dispatch({type: types.DWOLLA_PAYMENT_TRANSACTION_STATUS, message});
        dispatch({type: types.DWOLLA_PAYMENT_FORM_UPDATE, name: 'saved', value: true});
      });
    });

  };
}
