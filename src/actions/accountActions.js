import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';

import * as api from './api';
import {updateUserInfo} from './loginActions';

export function loadAccountInfo() {
  return function(dispatch, getState){

    //ajax request will be here
    dispatch({
      type: types.ACCOUNT_UPDATE,
      highlights: {
        propOwned: 3,
        tenantsServed: 6,
        paymentsReceived: 12,
        fundsReceived: 26550,
        memberAge: 1.2
      }
    });
  };
}

export function editModeUpdate(panelName, value) {
 return {
   type: types.ACCOUNT_EDIT_MODE,
   panelName,
   value
 };
}

export const loadProfileInfo = () => {
  return (dispatch, getState) => {
    let requestUser = api.getUserDetails(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'profile', true);

    Promise.all([
      requestUser
    ])
    .then((results) => {
      const profile = results[0];

      dispatch({ type: types.PROFILE_LOAD, payload: profile });

      api.setStatus(dispatch, 'loading', 'profile', false);
    });
  };
};

export const saveUserDetails = (payload, callback) => {
  return function (dispatch, getState) {
    api.postUserDetails(dispatch, getState, payload, (response) => {
      dispatch({ type: types.PROFILE_LOAD, payload: response });
      dispatch(updateUserInfo(user => {
        dispatch({type: types.DASHBOARD_USER_SAVE, user});
      }));
      if (callback) callback();
    });
  };
};

export function uploadProfilePic(file) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'uploading', 'profilePicUpload', true);
    api.uploadProfilePic(dispatch, getState, file, () => {
      api.setStatus(dispatch, 'uploading', 'profilePicUpload', false);
      dispatch(updateUserInfo());
    });

  };
}

export function saveAccountLogin(payload, callback) {
  return function (dispatch, getState) {
    api.postUserLoginUpdate(dispatch, getState, payload, (response) => {
      if (response.status !== 200) {
        dispatch({type: types.LOGIN_FORM_UPDATE, success: false, error: response.message});
        if (callback) callback();
        return;
      }

      dispatch({type: types.LOGIN_FORM_UPDATE, success: true, error: null});
      if (callback) callback();
    });
  };
}


// Simulated Action
export function receiveDocumentPayment() {
  return {
    type: types.RECEIVE_DOCUMENT_PAYMENT
  };
}

/**
 * Account Documents
 */

export function loadAccountDocuments(callback) {
  return function (dispatch, getState) {
    let files = getState().accountAppState.accountDocuments.files;
    if (files.length > 0) {
      dispatch({
        type: types.ACCOUNT_DOCUMENTS_LOAD
      });
      if (callback) callback();
      return;
    }
    api.setStatus(dispatch, 'loading', 'dashboardAccountDocuments', true);
    api.browseDocuments(dispatch, getState, (files) => {
      for (let i = 0; i < files.length; i++) {
        files[i].extension = files[i].itemPath.split('.').pop();
      }

      dispatch({
        type: types.ACCOUNT_DOCUMENTS_LOAD,
        files
      });

      api.setStatus(dispatch, 'loading', 'dashboardAccountDocuments', false);

      if (callback) callback();
    });
  };
}

export function loadAccountDocumentsForm(documentsData) {
 return function (dispatch, getState) {
   dispatch({
     type: types.ACCOUNT_DOCUMENTS_FORM_LOAD,
     documentsData
   });
 };
}

// used for refreshing the files data
export function updateAccountDocuments(callback) {
  return function (dispatch, getState) {
    api.browseDocuments(dispatch, getState, (files) => {
      for (let i = 0; i < files.length; i++) {
        files[i].extension = files[i].itemPath.split('.').pop();
      }

      dispatch({
        type: types.ACCOUNT_DOCUMENTS_UPDATE,
        files
      });

      if (callback) callback();
    });
  };
}

export function updateAccountDocumentsForm(settings, name, value) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'modified', 'accountDocuments', true);
    dispatch({type: types.ACCOUNT_DOCUMENTS_FORM_UPDATE, settings, name, value});
  };
}

export function openAccountDocumentsFile(filepath, callback) {
  return function (dispatch, getState) {
    const docWindow = window.open('', 'docWindow');
    docWindow.document.title = 'Loading...';
    api.getDocumentBlobUrl(dispatch, getState, filepath, (url) => {
      docWindow.document.title = 'Fit To Rent - Document';
      window.open(url, 'docWindow');
      if (callback) callback();
    });
  };
}

export function deleteAccountDocumentsFile(file, i, callback) {
  return function (dispatch, getState) {
    let payload = [file.itemPath];

    api.setStatus(dispatch, 'loading', 'deleteFile'+i, true);
    api.deleteDocuments(dispatch, getState, payload, () => {
      api.browseDocuments(dispatch, getState, (files) => {
        for (let i = 0; i < files.length; i++) {
          files[i].extension = files[i].itemPath.split('.').pop();
        }

        dispatch({
          type: types.ACCOUNT_DOCUMENTS_FORM_UPDATE,
          name: 'files',
          value: files
        });

        api.setStatus(dispatch, 'loading', 'deleteFile'+i, false);

        dispatch({type: types.ACCOUNT_DOCUMENTS_SAVE});

        if (callback) callback();
      });
    });
  };
}

export function uploadAccountDocumentsFile(file, callback) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'uploading', 'uploadFile', true);
    api.uploadFile(dispatch, getState, file, () => {
      api.browseDocuments(dispatch, getState, (files) => {
        for (let i = 0; i < files.length; i++) {
          files[i].extension = files[i].itemPath.split('.').pop();
        }

        dispatch({
          type: types.ACCOUNT_DOCUMENTS_FORM_UPDATE,
          name: 'files',
          value: files
        });

        api.setStatus(dispatch, 'uploading', 'uploadFile', false);

        dispatch({type: types.ACCOUNT_DOCUMENTS_SAVE});

        if (callback) callback();
      });
    });
  };
}
