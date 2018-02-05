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

  employment: '',
  salary: '',
  backgroundCheck: '',
  creditCheck: '',
  employmentVerification: '',
  drugScreening: '',
  f2rId: '',
  contactInfo: '',
  linkedin: '',

  success: null,
  error: null
};


export default function verifyAppState(state = initialState, action) {
  switch (action.type) {


    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['status'][action.statusType][action.statusAction] = action.statusState;
        return newState;
      }


    // verify form

    case types.VERIFY_DECRYPT_TOKEN:
      {
        let newState = objectAssign({}, state);
        newState['token'] = action.token;
        newState['prefill'] = action.prefill;
        return newState;
      }

    case types.VERIFY_FORM_CLEAR:
      {
        let newState = objectAssign({}, state);
        newState['employment'] = null;
        newState['salary'] = null;
        newState['backgroundCheck'] = null;
        newState['creditCheck'] = null;
        newState['employmentVerification'] = null;
        newState['drugScreening'] = null;
        newState['f2rId'] = null;
        newState['contactInfo'] = null;
        newState['linkedin'] = null;
        return newState;
      }

    case types.VERIFY_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[action.name] = action.value;
        return newState;
      }

    case types.VERIFY_FORM_SUBMIT:
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
