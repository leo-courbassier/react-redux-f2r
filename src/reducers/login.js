import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {

  status:{
    loading:{},
    uploading:{},
    saving:{},
    modified:{}
  },

  authorized: null,
  auth: null,

  user: {
    email: null,
    password: null
  },
  userInfo:{


  },
  stateList:[]
};


export default function loginAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState['status'][action.statusType][action.statusAction] = action.statusState;
      return newState;
    }


    // login form

    case types.LOGIN_FORM_CLEAR:
      {
        let newState = objectAssign({}, state);
        newState.user = {email: null, password: null};
        return newState;
      }

    case types.LOGIN_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState.user[action.name] = action.value;
        return newState;
      }

    case types.USER_LOGIN:
      {
        let newState = objectAssign({}, state);
        newState['authorized'] = action.authorized;
        newState['auth'] = action.auth;
        if(action.json){
          newState.userInfo = action.json
        }
        return newState;
      }

      case types.USER_LOGOUT:
      {
        let newState = objectAssign({}, state);
        newState['authorized'] = null;
        newState['auth'] = null;
        newState.userInfo = {};
        return newState;
      }

      case types.UPDATE_USER_INFO:
      {
        let newState = objectAssign({}, state);
        if(action.user){
          newState.userInfo = action.user
        }
        return newState;
      }

    default:
      return state;
  }
}
