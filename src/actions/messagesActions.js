import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import { MESSAGES_PAGE_SIZE } from '../constants/App';
import * as api from './api';
import smoothScroll from 'smooth-scroll';

export function loadMessages(folder, onlyMessages, callback) {
  return function (dispatch, getState) {
    let current = 0;
    let pageSize = MESSAGES_PAGE_SIZE + 1; // grab extra to see if there's a 2nd page
    let requests = [];

    if (folder === 'inbox') requests.push(api.getMessageInbox(dispatch, getState, current, pageSize));
    else requests.push(api.getMessageOutbox(dispatch, getState, current, pageSize));

    if (!onlyMessages) requests.push(api.getLeaseTenants(dispatch, getState));

    api.setStatus(dispatch, 'loading', folder, true);

    Promise.all(requests)
    .then((results) => {
      let messages = results[0];
      let tenants = !onlyMessages ? results[1] : null;
      let data = null;

      if (messages.length > 0) {
        let end = messages.length <= MESSAGES_PAGE_SIZE ? messages.length : messages.length - 1;
        data = {
          items: messages.slice(0, end),
          hasNext: messages.length <= MESSAGES_PAGE_SIZE
        };
      }

      dispatch({type: types.MESSAGES_LOAD, data, folder, tenants});

      api.setStatus(dispatch, 'loading', folder, false);

      if (callback) callback();
    });
  };
}

export function nextPage(folder) {
  return function (dispatch, getState) {
    let messages = getState().messagesAppState[folder];
    let current = getState().messagesAppState[`${folder}Current`];
    let next = current + 1;
    let pageSize = MESSAGES_PAGE_SIZE + 1; // grab extra to see if there's a next page

    if (messages[next]) {
      dispatch({
        type: types.MESSAGES_PAGE_NEXT,
        folder
      });

      smoothScroll.animateScroll(0);

      return;
    }

    let request = folder === 'inbox' ?
                  api.getMessageInbox(dispatch, getState, next * MESSAGES_PAGE_SIZE, pageSize) :
                  api.getMessageOutbox(dispatch, getState, next * MESSAGES_PAGE_SIZE, pageSize);

    api.setStatus(dispatch, 'loading', 'inboxNext', true);

    request.then(results => {
      let newMessages = results;
      let data = null;

      if (newMessages.length > 0) {
        let end = newMessages.length <= MESSAGES_PAGE_SIZE ? newMessages.length : newMessages.length - 1;
        data = {
          items: newMessages.slice(0, end),
          hasNext: newMessages.length <= MESSAGES_PAGE_SIZE
        };
      }

      api.setStatus(dispatch, 'loading', 'inboxNext', false);

      dispatch({
        type: types.MESSAGES_PAGE_NEXT,
        folder,
        data
      });

      smoothScroll.animateScroll(0);
    });
  };
}

export function prevPage(folder) {
  return function (dispatch, getState) {
    dispatch({
      type: types.MESSAGES_PAGE_PREVIOUS,
      folder
    });

    smoothScroll.animateScroll(0);
  };
}

export function selectMessage(folder, id, selected) {
  return function (dispatch, getState) {
    dispatch({
      type: types.MESSAGES_SELECT,
      folder,
      id,
      selected
    });
  };
}

export function deleteMessages(folder, ids, callback) {
  return function (dispatch, getState) {
    let folderType = folder === 'inbox' ? 'INBOX' : 'OUTBOX';
    api.setStatus(dispatch, 'loading', 'deleteMessages', true);
    api.deleteMessages(dispatch, getState, folderType, ids, response => {
      let success = !(response && 'status' in response && response.status !== 200);
      dispatch({type: types.MESSAGES_DELETE, folder, ids});
      api.setStatus(dispatch, 'loading', 'deleteMessages', false);
      if (callback) callback(success);
    });
  };
}

export function updateComposeForm(name, value) {
  return function (dispatch, getState) {
    dispatch({type: types.MESSAGES_COMPOSE_FORM_UPDATE, name, value});
  };
}

export function updateReplyForm(name, value) {
  return function (dispatch, getState) {
    dispatch({type: types.MESSAGES_REPLY_FORM_UPDATE, name, value});
  };
}

export function updateTo(to, callback) {
  return function (dispatch, getState) {
    let compose = getState().messagesAppState.compose;

    if (to) {
      api.getUserByEmail(dispatch, getState, to, user => {
        if (user) {
          let newTo = `${user.firstName} ${user.lastName} <${to}>`;
          let toUserId = user.id;
          dispatch({type: types.MESSAGES_COMPOSE_TO_UPDATE, to: newTo, toUserId});
          if (callback) callback(user);
        } else {
          let toUserId = null;
          dispatch({type: types.MESSAGES_COMPOSE_TO_UPDATE, toUserId});
          if (callback) callback(null);
        }
      });
    } else {
      let newTo = '';
      let toUserId = null;
      dispatch({type: types.MESSAGES_COMPOSE_TO_UPDATE, to: newTo, toUserId});
    }
  };
}

export function updateToUserId(toUserId, callback) {
  return function (dispatch, getState) {
    let to = '';
    dispatch({type: types.MESSAGES_COMPOSE_TO_UPDATE, to, toUserId});
  };
}

export function sendMessage(toEmail, payload, callback) {
  return function (dispatch, getState) {
    api.sendMessage(dispatch, getState, toEmail, payload, response => {
      let success = !(response && 'status' in response && response.status !== 200);
      dispatch({type: types.MESSAGES_COMPOSE_SEND, success});
      if (callback) callback(success);
    });
  };
}

export function sendReply(payload, callback) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'loading', 'replySubmit', true);
    api.sendMessage(dispatch, getState, null, payload, response => {
      let success = !(response && 'status' in response && response.status !== 200);
      dispatch({type: types.MESSAGES_REPLY_SEND, success});
      api.setStatus(dispatch, 'loading', 'replySubmit', false);
      if (callback) callback(success);
    });
  };
}

export function resetCompose() {
  return function (dispatch, getState) {
    dispatch({type: types.MESSAGES_COMPOSE_RESET});
  };
}

export function resetReply() {
  return function (dispatch, getState) {
    dispatch({type: types.MESSAGES_REPLY_RESET});
  };
}

export function loadMessage(folder, id, callback) {
  return function (dispatch, getState) {
    let folderType = folder === 'inbox' ? 'INBOX' : 'OUTBOX';
    api.setStatus(dispatch, 'loading', 'singleMessage', true);
    api.getMessage(dispatch, getState, folderType, id, response => {
      let message = response;
      dispatch({type: types.MESSAGES_SINGLE_LOAD, message, folder});
      if (callback) callback();
      api.setStatus(dispatch, 'loading', 'singleMessage', false);
    });
  };
}

export function markAsRead(folder, id, callback) {
  return function (dispatch, getState) {
    api.flagMessage(dispatch, getState, id, response => {
      let success = !(response && 'status' in response && response.status !== 200);
      dispatch({type: types.MESSAGES_MARK_AS_READ, folder, id});
      dispatch({type: types.NOTIFICATION_MESSAGES_UNREAD_DECREMENT});
      if (callback) callback(success);
    });
  };
}
