import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {

  status: {
    loading: {},
    uploading: {},
    saving: {},
    modified: {}
  },

  userInfo: {}, //probably we will remove it in future
  highlights: {}
};


export default function accountAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState['status'][action.statusType][action.statusAction] = action.statusState;
      return newState;
    }


    case types.USER_LOGIN:
    {
      let newState = objectAssign({}, state);
      if (action.json) {
        newState.userInfo = action.json
      }
      return newState;
    }

    case types.USER_LOGOUT:
    {
      let newState = objectAssign({}, state);
      newState.userInfo = {};
      return newState;
    }

    case types.UPDATE_USER_INFO:
    {
      let newState = objectAssign({}, state);
      if (action.user) {
        newState.userInfo = action.user
      }
      return newState;
    }

    case types.ACCOUNT_UPDATE:
    {
      let newState = objectAssign({}, state);
      if(action.highlights){
        newState.highlights = action.highlights;
      }
      return newState;
    }

    default:
      return state;
  }
}
