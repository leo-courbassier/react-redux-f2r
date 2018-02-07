import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {


  status:{
    loading:{},
    uploading:{},
    saving:{},
    modified:{}
  },


  success: null,
  error: null,
  addUser: {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null,
    acceptTerms: false,
    userType:null
  }
};


export default function signupAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['status'][action.statusType][action.statusAction] = action.statusState;
        return newState;
      }


    // signup form

    case types.SIGNUP_FORM_CLEAR:
      {
        let newState = objectAssign({}, state);
        newState.addUser = {firstName: null, lastName: null, email: null, password: null,userType:null};
        newState.success = null;
        newState.error = null;
        return newState;
      }

    case types.SIGNUP_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState.addUser[action.name] = action.value;
        return newState;
      }

    case types.SIGNUP_FORM_SUCCESS:
      {
        let newState = objectAssign({}, state);
        newState['success'] = action.success;
        newState['error'] = action.error;
        return newState;
      }

    default:
      return state;
  }
}
