import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';

import * as api from './api';

export const loadLeasesList = () => {
  return (dispatch, getState) => {
    let requestLeasesList = api.getLLLeasesList(dispatch, getState);

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
