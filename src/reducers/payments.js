import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {

  status: {
    loading: {},
    uploading: {},
    saving: {},
    modified: {}
  },

  editMode:{
    methods: false,
    center: false
  },

  stateList: [],
  cityList: [],

  fundingSources: [],
  creditCards: [],
  customerCreated: false,
  removeFundingSourceSuccess: null,
  removeCreditCardSuccess: null,

  tenants: [],
  makePaymentSuccess: null,
  makePaymentError: null,

  leases: [],
  requestPaymentSuccess: null,
  requestPaymentError: null,

  loaded: false, // Payment Methods panel
  makePaymentLoaded: false,
  requestPaymentLoaded: false

};

export default function paymentsAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState['status'][action.statusType][action.statusAction] = action.statusState;
      return newState;
    }

    case types.PAYMENTS_EDIT_MODE:
    {
      let newState = objectAssign({}, state);
      newState.editMode[action.panelName] = action.value;
      return newState;
    }

    case types.PAYMENTS_METHODS_LOAD:
    {
      let newState = objectAssign({}, state);
      newState.fundingSources = action.fundingSources;
      newState.creditCards = action.creditCards;
      newState.stateList = action.stateList;
      newState.customerCreated = action.customerCreated;
      newState.loaded = true;
      return newState;
    }

    case types.PAYMENTS_METHODS_CITIES_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState.cityList = action.cityList;
      return newState;
    }

    case types.PAYMENTS_METHODS_CUSTOMER_CREATED:
    {
      let newState = objectAssign({}, state);
      newState.customerCreated = true;
      return newState;
    }

    case types.PAYMENTS_METHODS_FUNDING_SOURCES_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState.fundingSources = action.fundingSources;
      return newState;
    }

    case types.PAYMENTS_METHODS_CREDIT_CARDS_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState.creditCards = action.creditCards;
      return newState;
    }

    case types.PAYMENTS_METHODS_REMOVE_FUNDING_SOURCE:
    {
      let newState = objectAssign({}, state);
      newState.removeFundingSourceSuccess = action.success;
      if (action.fundingSources) {
        newState.fundingSources = action.fundingSources;
      }
      return newState;
    }

    case types.PAYMENTS_METHODS_REMOVE_CREDIT_CARD:
    {
      let newState = objectAssign({}, state);
      newState.removeCreditCardSuccess = action.success;
      if (action.creditCards) {
        newState.creditCards = action.creditCards;
      }
      return newState;
    }

    case types.PAYMENTS_MAKE_LOAD:
    {
      let newState = objectAssign({}, state);
      newState.tenants = action.tenants;
      newState.fundingSources = action.fundingSources;
      newState.makePaymentLoaded = true;
      return newState;
    }

    case types.PAYMENTS_MAKE_SEND_PAYMENT:
    {
      let newState = objectAssign({}, state);
      newState.makePaymentSuccess = action.success;
      newState.makePaymentError = action.message;
      return newState;
    }

    case types.PAYMENTS_REQUEST_LOAD:
    {
      let newState = objectAssign({}, state);
      newState.tenants = action.tenants;
      newState.leases = action.leases;
      newState.requestPaymentLoaded = true;
      return newState;
    }

    case types.PAYMENTS_MAKE_REQUEST_PAYMENT:
    {
      let newState = objectAssign({}, state);
      newState.requestPaymentSuccess = action.success;
      newState.requestPaymentError = action.message;
      return newState;
    }

    default:
      return state;
  }
}
