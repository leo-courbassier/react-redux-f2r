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
  },

  alerts: [],
  alertsCount: 0,
  alertsPage: 0

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

    case types.NOTIFICATION_ALERTS_UPDATE:
      {
        let newState = objectAssign({}, state);
        if (action.forceReload) {
          newState['alerts'] = [];
        }
        if (action.data) {
          newState['alerts'].push(action.data);
        }
        newState['alertsPage'] = action.page;
        return newState;
      }

    case types.NOTIFICATION_ALERTS_COUNT_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['alertsCount'] = action.count;
        return newState;
      }

    case types.NOTIFICATION_ALERTS_DELETE:
      {
        let newState = objectAssign({}, state);
        if (newState['alertsCount'] > 0) {
          newState['alertsCount']--;
        }
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
