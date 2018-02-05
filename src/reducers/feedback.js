import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {
  status:{
    loading:{},
    uploading:{},
    saving:{},
    modified:{}
  },

  token: null,
  prefill: {},

  statesList:[],
  citiesList:[],

  streetAddress: '',
  city: '',
  state: '',
  zip: '',
  responsibilityMaintainence: '',
  responsibilityAlerts: '',
  responsibilityExtra: '',
  responsibilityPet: '',
  responsibilityComplaints: '',
  reliabilitySecurity: '',
  reliabilityPay: '',
  reliabilityPayFull: '',
  repeatabilityBackgroundCheck: '',
  repeatabilityCreditCheck: '',
  repeatabilityEmploymentVerification: '',
  repeatabilityRentAgain: '',
  rating: '',
  thoughts: '',
  contactInfo: '',

  success: null,
  error: null
};


export default function feedbackAppState(state = initialState, action) {
  switch (action.type) {


    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['status'][action.statusType][action.statusAction] = action.statusState;
        return newState;
      }


    // feedback form

    case types.FEEDBACK_DECRYPT_TOKEN:
      {
        let newState = objectAssign({}, state);
        newState['token'] = action.token;
        newState['prefill'] = action.prefill;
        return newState;
      }

    case types.FEEDBACK_SET_STATES_LIST:
      {
        let newState = objectAssign({}, state);
        newState['statesList'] = action.statesList;
        return newState;
      }

    case types.FEEDBACK_SET_CITIES_LIST:
      {
        let newState = objectAssign({}, state);
        newState['citiesList'] = action.citiesList;
        return newState;
      }

    case types.FEEDBACK_FORM_CLEAR:
      {
        let newState = objectAssign({}, state);
        newState['streetAddress'] = null;
        newState['city'] = null;
        newState['state'] = null;
        newState['zip'] = null;
        newState['responsibilityMaintainence'] = null;
        newState['responsibilityAlerts'] = null;
        newState['responsibilityExtra'] = null;
        newState['responsibilityPet'] = null;
        newState['responsibilityComplaints'] = null;
        newState['reliabilitySecurity'] = null;
        newState['reliabilityPay'] = null;
        newState['reliabilityPayFull'] = null;
        newState['repeatabilityBackgroundCheck'] = null;
        newState['repeatabilityCreditCheck'] = null;
        newState['repeatabilityEmploymentVerification'] = null;
        newState['repeatabilityRentAgain'] = null;
        newState['rating'] = null;
        newState['thoughts'] = null;
        return newState;
      }

    case types.FEEDBACK_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[action.name] = action.value;
        return newState;
      }

    case types.FEEDBACK_FORM_SUBMIT:
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
