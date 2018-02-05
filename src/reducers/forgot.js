import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {

  status:{
    loading:{},
    uploading:{},
    saving:{},
    modified:{}
  },

  email: null,
  success: null,
  error: null
};


export default function forgotAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['status'][action.statusType][action.statusAction] = action.statusState;
        return newState;
      }


    // forgot form

    case types.FORGOT_FORM_CLEAR:
      {
        let newState = objectAssign({}, state);
        newState['email'] = null;
        newState['error'] = null;
        newState['success'] = null;
        return newState;
      }

    case types.FORGOT_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[action.name] = action.value;
        return newState;
      }

    case types.FORGOT_FORM_SUCCESS:
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
