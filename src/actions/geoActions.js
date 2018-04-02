import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';

import * as api from './api';
import { GEO_CITIES } from '../constants/Services';

export const loadStateList = () => {
  return (dispatch, getState) => {
    const states = getState().geoAppState.states;
    if (states && states.length > 0) return; // already loaded states, no need to load again.

    const requestStateList = api.getStateList(dispatch, getState);
    api.setStatus(dispatch, 'loading', 'states', true);

    Promise.all([
      requestStateList
    ])
    .then((results) => {
      const states = results[0];
      dispatch({ type: types.STATE_LIST_LOAD, payload: states });
      results.length > 0 && dispatch(loadCityList(states[0]));
      api.setStatus(dispatch, 'loading', 'states', false);
    });
  };
};

export const loadCityList = (stateCode) => {
  return (dispatch, getState) => {
    const cities = getState().geoAppState.cities[stateCode];
    if (cities && cities.length) return; // already loaded cities, no need to load again.

    const authHeader = api.getAuthHeaders(dispatch, getState);
    const requestCityList = api.get(GEO_CITIES + `?state=${stateCode}`, authHeader);
    api.setStatus(dispatch, 'loading', 'cities', true);

    Promise.all([
      requestCityList
    ])
    .then((results) => {
      dispatch({
        type: types.CITY_LIST_LOAD,
        payload: {
          [stateCode]: results[0]
        }
      });

      api.setStatus(dispatch, 'loading', 'cities', false);
    });
  };
};

