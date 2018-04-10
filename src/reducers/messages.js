import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {

  status:{
    loading:{},
    uploading:{},
    saving:{},
    modified:{}
  },

  inbox: [],
  sent: [],
  inboxCurrent: 0,
  sentCurrent: 0,
  inboxSelectedMessages: [],
  sentSelectedMessages: [],
  inboxLoaded: false,
  sentLoaded: false,

  tenants: [],

  compose: {
    to: '',
    toUserId: null,
    subject: '',
    message: '',
    success: null
  },

  reply: {
    subject: '',
    message: '',
    success: null
  },

  singleMessages: {
    inbox: [],
    sent: []
  },

  newSentMessages: false

};

export default function messagesAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['status'][action.statusType][action.statusAction] = action.statusState;
        return newState;
      }

    case types.MESSAGES_LOAD:
      {
        let newState = objectAssign({}, state);

        // reset sent folder if there are new messages
        if (newState['newSentMessages']) {
          newState[action.folder] = [];
          newState['newSentMessages'] = false;
        }

        newState[action.folder] = [];
        newState[action.folder].push(action.data);

        // load data for viewing single messages
        // this is needed because to/fromUserFullName is not available in "message/" endpoint
        if (action.data) {
          for (let i = 0; i < action.data.items.length; i++) {
            let message = action.data.items[i];
            newState['singleMessages'][action.folder][message.id] = message;
            newState['singleMessages'][action.folder][message.id].loaded = false;
          }
        }

        if (action.tenants) newState['tenants'] = action.tenants;

        newState[`${action.folder}Loaded`] = true;

        return newState;
      }

    case types.MESSAGES_PAGE_NEXT:
    {
      let newState = objectAssign({}, state);
      if (action.data) {
        newState[action.folder].push(action.data);

        // load data for viewing single messages
        // this is needed because to/fromUserFullName is not available in "message/" endpoint
        for (let i = 0; i < action.data.items.length; i++) {
          let message = action.data.items[i];
          newState['singleMessages'][action.folder][message.id] = message;
          newState['singleMessages'][action.folder][message.id].loaded = false;
        }
      }
      newState[`${action.folder}Current`]++;
      return newState;
    }

    case types.MESSAGES_PAGE_PREVIOUS:
    {
      let newState = objectAssign({}, state);
      newState[`${action.folder}Current`]--;
      return newState;
    }

    case types.MESSAGES_SELECT:
      {
        let newState = objectAssign({}, state);
        let current = newState[`${action.folder}Current`];
        if (!newState[`${action.folder}SelectedMessages`][current]) {
          newState[`${action.folder}SelectedMessages`][current] = [];
        }
        if (action.selected) {
          if (action.id) {
            // Select One
            newState[`${action.folder}SelectedMessages`][current].push(action.id);
          } else {
            // Select All
            newState[`${action.folder}SelectedMessages`][current] = [];
            for (let message of newState[action.folder][current].items) {
              newState[`${action.folder}SelectedMessages`][current].push(message.id);
            }
          }
        } else {
          if (action.id) {
            // De-select one
            let index = newState[`${action.folder}SelectedMessages`].indexOf(action.id);
            newState[`${action.folder}SelectedMessages`][current].splice(index, 1);
          } else {
            // Select None
            let index = newState[`${action.folder}SelectedMessages`].indexOf(current);
            newState[`${action.folder}SelectedMessages`].splice(index, 1);
          }
        }
        return newState;
      }

    case types.MESSAGES_DELETE:
      {
        let newState = objectAssign({}, state);
        newState[`${action.folder}SelectedMessages`] = [];
        return newState;
      }

    case types.MESSAGES_COMPOSE_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['compose'][action.name] = action.value;
        return newState;
      }

    case types.MESSAGES_REPLY_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['reply'][action.name] = action.value;
        return newState;
      }

    case types.MESSAGES_COMPOSE_TO_UPDATE:
      {
        let newState = objectAssign({}, state);
        if (action.to || action.to === null) {
          newState['compose']['to'] = action.to;
        }
        newState['compose']['toUserId'] = action.toUserId;
        return newState;
      }

    case types.MESSAGES_COMPOSE_SEND:
      {
        let newState = objectAssign({}, state);
        newState['compose']['success'] = action.success;
        if (action.success === true) {
          newState['compose']['to'] = '';
          newState['compose']['toUserId'] = null;
          newState['compose']['subject'] = '';
          newState['compose']['message'] = ''; // maintains controlled textarea
          newState['newSentMessages'] = true;
        }
        return newState;
      }

    case types.MESSAGES_COMPOSE_RESET:
      {
        let newState = objectAssign({}, state);
        newState['compose']['to'] = '';
        newState['compose']['toUserId'] = null;
        newState['compose']['subject'] = '';
        newState['compose']['message'] = '';
        newState['compose']['success'] = null;
        return newState;
      }

    case types.MESSAGES_REPLY_SEND:
      {
        let newState = objectAssign({}, state);
        newState['reply']['success'] = action.success;
        if (action.success === true) {
          newState['reply']['subject'] = '';
          newState['reply']['message'] = '';
          newState['newSentMessages'] = true;
        }
        return newState;
      }

    case types.MESSAGES_REPLY_RESET:
      {
        let newState = objectAssign({}, state);
        newState['reply']['subject'] = '';
        newState['reply']['message'] = '';
        newState['reply']['success'] = null;
        return newState;
      }

    case types.MESSAGES_SINGLE_LOAD:
      {
        let newState = objectAssign({}, state);
        if (!(action.message.id in newState['singleMessages'][action.folder])) {
          newState['singleMessages'][action.folder][action.message.id] = action.message;
        } else {
          // merge action.message without ovewriting current data
          newState['singleMessages'][action.folder][action.message.id] = objectAssign({}, newState['singleMessages'][action.folder][action.message.id], action.message);
        }
        newState['singleMessages'][action.folder][action.message.id].loaded = true;
        return newState;
      }

    case types.MESSAGES_MARK_AS_READ:
      {
        let newState = objectAssign({}, state);
        newState['singleMessages'][action.folder][action.id].newMessageFlag = false;
        return newState;
      }

    default:
      return state;
  }
}
