import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {

  status:{
    loading:{},
    uploading:{},
    saving:{},
    modified:{}
  },

  dwollaVerifiedStatus: false,
  dwollaToken: null,
  dwollaAmount: null,
  dwollaAccountList: null,
  dwollaSelectedAccount: null,
  dwollaTransactionStatus: null

};

export default function dwollaAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState['status'][action.statusType][action.statusAction] = action.statusState;
      return newState;
    }

    case types.DWOLLA_PAYMENT_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[action.name] = action.value;
        return newState;
      }

    case types.DWOLLA_PAYMENT_FORM_RESET:
      {
        let newState = objectAssign({}, state);
        newState['dwollaTransactionStatus'] = null;
        newState['dwollaAmount'] = null;
        return newState;
      }

    case types.DWOLLA_PAYMENT_TRANSACTION_STATUS:
      {
        let newState = objectAssign({}, state);
        newState['dwollaTransactionStatus'] = action.message;
        return newState;
      }

    case types.DWOLLA_PAYMENT_VERIFIED_STATUS:
      {
        let newState = objectAssign({}, state);
        newState['dwollaVerifiedStatus'] = action.verified;
        return newState;
      }

    case types.DWOLLA_PAYMENT_TOKEN:
      {
        let newState = objectAssign({}, state);
        newState['dwollaToken'] = action.token;
        return newState;
      }

    case types.DWOLLA_PAYMENT_LOAD_ACCOUNT_LIST:
      {
        let newState = objectAssign({}, state);
        newState['dwollaAccountList'] = action.accounts;
        if(action.accounts.length > 0){
          newState['dwollaSelectedAccount'] = action.accounts[0].id;
        }
        return newState;
      }

    default:
      return state;
  }
}
