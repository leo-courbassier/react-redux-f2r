import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {

  status:{
    loading:{},
    uploading:{},
    saving:{},
    modified:{}
  },

  stripeAcctExists: false,
  stripeCardExists: false,

  stripeNumber: null,
  stripeExpiryMonth: null,
  stripeExpiryYear: null,
  stripeCVC: null,
  stripeAmount: null,
  stripeTransactionStatus: null

};

export default function stripeAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState['status'][action.statusType][action.statusAction] = action.statusState;
      return newState;
    }

    case types.STRIPE_PAYMENT_LOAD:
      {
        let newState = objectAssign({}, state);
        newState['stripeAcctExists'] = action.stripeAcctExists;
        newState['stripeCardExists'] = action.stripeCardExists;
        return newState;
      }

    case types.STRIPE_PAYMENT_TRANSACTION_STATUS:
      {
        let newState = objectAssign({}, state);
        newState['stripeTransactionStatus'] = action.message;
        return newState;
      }

    case types.STRIPE_PAYMENT_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[action.name] = action.value;
        return newState;
      }

    case types.STRIPE_PAYMENT_FORM_RESET:
      {
        let newState = objectAssign({}, state);
        newState['stripeNumber'] = null;
        newState['stripeExpiryMonth'] = null;
        newState['stripeExpiryYear'] = null;
        newState['stripeCVC'] = null;
        newState['stripeAmount'] = null;
        return newState;
      }

    default:
      return state;
  }
}
