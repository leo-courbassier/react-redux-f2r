import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';

import * as api from './api';

export const loadPropertiesList = () => {
  return (dispatch, getState) => {
    let requestPropertiesList = api.getPropertyList(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'propertiesList', true);

    Promise.all([
      requestPropertiesList
    ])
    .then((results) => {
      const properties = results;

      dispatch({ type: types.PROPERTIES_LIST_LOAD, payload: properties });

      api.setStatus(dispatch, 'loading', 'propertiesList', false);
    });
  };
};
