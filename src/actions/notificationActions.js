import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import { ALERTS_PAGE_SIZE } from '../constants/App';
import * as api from './api';

export function updateAlerts(page = 0, forceReload = false, callback) {
  return function (dispatch, getState) {
    let alerts = getState().notificationAppState.alerts;

    // If the page data already exists, simply switch to that page
    if (alerts[page] && !forceReload) {
      dispatch({
        type: types.NOTIFICATION_ALERTS_UPDATE,
        page
      });

      if (callback) callback(alerts[page]);

      return;
    }

    api.setStatus(dispatch, 'loading', 'alerts', true);

    api.getAlerts(dispatch, getState, page, ALERTS_PAGE_SIZE, newAlerts => {
      let alertsCount = getState().notificationAppState.alertsCount;

      let data = null;

      if (newAlerts.length > 0) {
        data = {
          items: newAlerts,
          hasNext: ((page + 1) * ALERTS_PAGE_SIZE) < alertsCount
        }
      }

      dispatch({
        type: types.NOTIFICATION_ALERTS_UPDATE,
        data,
        page,
        forceReload
      });

      api.setStatus(dispatch, 'loading', 'alerts', false);

      if (callback) callback(alerts);
    });
  };
}

export function updateAlertsCount(callback) {
  return function (dispatch, getState) {
    api.getAlertsCount(dispatch, getState, count => {
      count = parseInt(count)

      dispatch({
        type: types.NOTIFICATION_ALERTS_COUNT_UPDATE,
        count
      });

      if (callback) callback(count);
    });
  };
}

export function deleteAlert(id, callback) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'loading', 'deleteAlert'+id, true);
    api.deleteAlerts(dispatch, getState, [id], response => {
      api.setStatus(dispatch, 'loading', 'deleteAlert'+id, false);
      dispatch({type: types.NOTIFICATION_ALERTS_DELETE,});
      if (callback) callback(response);
    });
  };
}

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
