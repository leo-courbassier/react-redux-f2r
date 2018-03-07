import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';



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
