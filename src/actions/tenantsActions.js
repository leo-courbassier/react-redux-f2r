import * as types from '../constants/ActionTypes';
import _ from 'lodash';
import * as api from './api';

export const loadTenantsList = () => {
  return (dispatch, getState) => {
    const requestTenantsList = api.getLLTenantsList(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'tenantsList', true);

    Promise.all([
      requestTenantsList
    ])
    .then((results) => {
      const tenants = results[0];

      dispatch({ type: types.TENANTS_LIST_LOAD, payload: tenants });

      api.setStatus(dispatch, 'loading', 'tenantsList', false);
    });
  };
};
