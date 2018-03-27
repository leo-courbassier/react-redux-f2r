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
  highlights: {},

  editMode:{
    profile: false,
    documents: false,
    password: false
  },
  paymentsReceived: false,
  
  accountDocuments: {
    files: [],
    loaded: false
  },

  accountDocumentsForm: {
    files: [],
    loaded: false
  },

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
        newState.userInfo = action.json;
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
        newState.userInfo = action.user;
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

    case types.ACCOUNT_EDIT_MODE:
    {
      let newState = objectAssign({}, state);
      newState.editMode[action.panelName] = action.value;
      return newState;
    }

    case types.PROFILE_LOAD:
      return objectAssign({}, state, {
        profile: action.payload
      });

    case types.RECEIVE_DOCUMENT_PAYMENT:
      return objectAssign({}, state, {
        paymentsReceived: true
      });

    /**
     * Account Documents
     */

    case types.ACCOUNT_DOCUMENTS_LOAD:
    {
     let newState = objectAssign({}, state);
     if (action.files) newState['accountDocuments']['files'] = action.files;
     newState['accountDocuments']['loaded'] = true;
     return newState;
    }

    case types.ACCOUNT_DOCUMENTS_UPDATE:
    {
     let newState = objectAssign({}, state);
     newState['accountDocuments']['files'] = action.files;
     return newState;
    }

    case types.ACCOUNT_DOCUMENTS_FORM_LOAD:
    {
     let newState = objectAssign({}, state);
     newState['accountDocumentsForm'] = objectAssign({}, action.documentsData);
     return newState;
    }

    case types.ACCOUNT_DOCUMENTS_FORM_UPDATE:
    {
     let newState = objectAssign({}, state);
     newState['accountDocumentsForm'][action.name] = action.value;
     return newState;
    }

    case types.ACCOUNT_DOCUMENTS_SAVE:
    {
      let newState = objectAssign({}, state);
      newState['accountDocuments'] = objectAssign({}, newState['accountDocumentsForm']);
      return newState;
    }

    default:
      return state;
  }
}
