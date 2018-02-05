import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';
import _ from 'underscore';

const initialState = {

  status:{
    loading:{},
    uploading:{},
    saving:{},
    modified:{}
  },

  price:0,
  prices:[0],
  services:[],
  discountCode:null,
  discountValue:0,
  catalog:[],
  accts:[],
  hasGuarantor:null,

  stripeNumber:null,
  stripeExpiryMonth:null,
  stripeExpiryYear:null,
  stripeCVC:null,
  stripeAmount:null,
  stripeTransactionStatus:null,

  discountSuccess:null,
  discountError:null,

  success:null,
  error:null
};


export default function checkoutAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['status'][action.statusType][action.statusAction] = action.statusState;
        return newState;
      }

    case types.CHECKOUT_LOAD:
      {
        let newState = objectAssign({}, state);
        newState['catalog'] = action.catalog;
        newState['accts'] = action.accts;
        action.catalog.map(item => {
          let addService = true;
          if (item.title === 'F2R Guarantor Verification Service') {
            addService = action.hasGuarantor;
          }
          if (addService) {
            newState['price'] += item.price;
            newState['prices'].push({
              item,
              price: newState['price']
            });
            newState['services'].push(item.id);
          }
        });
        newState['prices'].splice(0, 1); // remove first item
        newState['hasGuarantor'] = action.hasGuarantor;
        return newState;
      }

    case types.CHECKOUT_FORM_CLEAR:
      {
        let newState = objectAssign({}, state);
        newState['price'] = 0;
        newState['prices'] = [0];
        newState['services'] = [];
        newState['discountCode'] = null;
        newState['discountValue'] = 0;
        newState['catalog'] = [];
        newState['accts'] = [];
        newState['stripeNumber'] = null,
        newState['stripeExpiryMonth'] = null,
        newState['stripeExpiryYear'] = null,
        newState['stripeCVC'] = null,
        newState['stripeAmount'] = null,
        newState['stripeTransactionStatus'] = null,
        newState['discountSuccess'] = null;
        newState['discountError'] = null;
        newState['success'] = null;
        newState['error'] = null;
        return newState;
      }

    case types.CHECKOUT_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[action.name] = action.value;
        return newState;
      }

    case types.CHECKOUT_APPLY_DISCOUNT:
      {
        let newState = objectAssign({}, state);
        newState['price'] = action.price;
        newState['discountValue'] = action.oldPrice - action.price;
        newState['discountSuccess'] = action.success;
        newState['discountError'] = action.error;
        return newState;
      }

    case types.CHECKOUT_REMOVE_SERVICE:
      {
        let newState = objectAssign({}, state);
        let pricesIndex;
        let catalogIndex;
        newState['price'] -= action.price;
        newState['prices'].map((price, i) => {
          if (price.item.id === action.id) {
            pricesIndex = i;
          }
        });
        newState['prices'].splice(pricesIndex, 1);
        newState['services'].splice(newState['services'].indexOf(action.id), 1);
        newState['catalog'].map((item, i) => {
          if (item.id === action.id) {
            catalogIndex = i;
          }
        });
        newState['catalog'].splice(catalogIndex, 1);
        return newState;
      }

    case types.CHECKOUT_FINISH:
      {
        let newState = objectAssign({}, state);
        newState['success'] = action.success;
        newState['error'] = action.message;
        return newState;
      }

    default:
      return state;
  }
}
