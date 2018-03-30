import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';

import * as api from './api';

export function editModeUpdate(panelName, value) {
 return {
   type: types.PROPERTY_EDIT_MODE,
   panelName,
   value
 };
}

export const loadPropertiesList = () => {
  return (dispatch, getState) => {
    let requestPropertiesList = api.getLLPropertiesList(dispatch, getState);

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

export const loadPropertyProfile = (propertyId) => {
  return (dispatch, getState) => {
    let requestPropertyProfile = api.getLLPropertyProfile(propertyId, dispatch, getState);

    api.setStatus(dispatch, 'loading', 'propertyProfile', true);

    Promise.all([
      requestPropertyProfile
    ])
    .then((results) => {
      const property = results[0][0];

      dispatch({ type: types.PROPERTY_PROFILE_LOAD, payload: property });

      api.setStatus(dispatch, 'loading', 'propertyProfile', false);
    });
  };
};
