import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {

  status:{
    loading:{},
    uploading:{},
    saving:{},
    modified:{}
  },

  messages: {
    unread: 0,
    new: false
  }

};

export default function notificationAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['status'][action.statusType][action.statusAction] = action.statusState;
        return newState;
      }

    case types.NOTIFICATION_MESSAGES_UPDATE:
      {
        let newState = objectAssign({}, state);
        if (action.messages.unread !== null) {
          newState['messages']['unread'] = action.messages.unread;
        }
        if (action.messages.new !== null) {
          newState['messages']['new'] = action.messages.new;
        }
        return newState;
      }

    case types.NOTIFICATION_MESSAGES_UNREAD_DECREMENT:
      {
        let newState = objectAssign({}, state);
        if (newState['messages']['unread'] > 0) {
          newState['messages']['unread']--;
        }
        return newState;
      }

    default:
      return state;
  }
}
