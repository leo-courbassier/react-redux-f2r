import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {

  status:{
    loading:{},
    uploading:{},
    saving:{},
    modified:{}
  },

  password: '',
  confirmPassword: '',
  success: null,
  error: null
};


export default function resetAppState(state = initialState, action) {
  switch (action.type) {


    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['status'][action.statusType][action.statusAction] = action.statusState;
        return newState;
      }


    // reset form

    case types.RESET_FORM_CLEAR:
      {
        let newState = objectAssign({}, state);
        newState['password'] = null;
        newState['confirmPassword'] = null;
        newState['error'] = null;
        newState['success'] = null;
        return newState;
      }

    case types.RESET_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[action.name] = action.value;
        return newState;
      }

    case types.RESET_FORM_SUCCESS:
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
