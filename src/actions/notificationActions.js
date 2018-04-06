import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import * as api from './api';

export function updateMessages(callback) {
  return function (dispatch, getState) {
    api.getMessagesCount(dispatch, getState, newCount => {
      let oldUnread = getState().notificationAppState.messages.unread;

      let messages = {
        unread: parseInt(newCount),
        new: null
      };

      if (messages.unread > oldUnread) {
        messages.new = true;
      }

      dispatch({
        type: types.NOTIFICATION_MESSAGES_UPDATE,
        messages
      });

      if (callback) callback(messages);
    });
  };
}

export function updateNewMessages(newMessages) {
  return function (dispatch, getState) {
    let messages = { new: newMessages, unread: null };
    dispatch({type: types.NOTIFICATION_MESSAGES_UPDATE, messages})
  };
}
