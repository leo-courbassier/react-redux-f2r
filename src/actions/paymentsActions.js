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

export function loadPaymentsMethods() {

}

export function loadPaymentsMethodsForm() {

}
