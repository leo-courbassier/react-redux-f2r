import * as types from '../constants/ActionTypes';
import _ from 'lodash';
import * as api from './api';

export const loadLeasesList = () => {
  return (dispatch, getState) => {
    const requestLeasesList = api.getLLLeasesList(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'leasesList', true);

    Promise.all([
      requestLeasesList
    ])
    .then((results) => {
      const leases = results[0];

      dispatch({ type: types.LEASES_LIST_LOAD, payload: leases });

      api.setStatus(dispatch, 'loading', 'leasesList', false);
    });
  };
};

export const loadLeaseDetails = (leaseId) => {
  return (dispatch, getState) => {
    const requestLeaseDetails = api.getLLLeaseDetails(leaseId, dispatch, getState);
    api.setStatus(dispatch, 'loading', 'leaseDetails', true);
    Promise.all([
      requestLeaseDetails
    ])
    .then((results) => {
      const leaseDetails = results[0][0];

      dispatch({ type: types.LEASE_DETAILS_LOAD, payload: leaseDetails });

      api.setStatus(dispatch, 'loading', 'leaseDetails', false);
    });
  };
};

const inviteTenants = (dispatch, getState, { tenants }, leaseId, callback) => {
  const requestInviteTenants = _.map(tenants, (tenant) => {
    return api.inviteTenant(dispatch, getState, tenant.email, leaseId);
  });

  Promise.all(requestInviteTenants)
  .then((results) => {
    if (callback) callback();
  });
};

export const addLeaseDetails = (payload, callback) => {
  return function (dispatch, getState) {
    const data = _.omit(payload, ['tenants']);
    api.setStatus(dispatch, 'saving', 'leaseDetails', true);
    api.addLLLeaseDetails(dispatch, getState, data, (response) => {
      dispatch({ type: types.LEASE_DETAILS_LOAD, payload: response });
      inviteTenants(dispatch, getState, payload, response.id, () => {
        api.setStatus(dispatch, 'saving', 'leaseDetails', false);
        if (callback) callback(response);
      });
    });
  };
};

export const updateLeaseDetails = (payload, callback) => {
  return function (dispatch, getState) {
    const data = _.omit(payload, ['tenants']);
    api.setStatus(dispatch, 'saving', 'leaseDetails', true);
    api.updateLLLeaseDetails(dispatch, getState, data, (response) => {
      dispatch({ type: types.LEASE_DETAILS_LOAD, payload: response });
      inviteTenants(dispatch, getState, payload, response.id, () => {
        api.setStatus(dispatch, 'saving', 'leaseDetails', false);
        if (callback) callback(response);
      });
    });
  };
};
