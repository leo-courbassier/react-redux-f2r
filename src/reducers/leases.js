import * as types from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
  status: {
    loading: {},
    modified: {},
    saving: {},
    uploading: {}
  },
  leasesList: [],
  propertiesList: []
};


export default function leasesAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
    {
      let newState = _.assign({}, state);
      newState['status'][action.statusType][action.statusAction] = action.statusState;
      return newState;
    }

    case types.LEASES_LIST_LOAD:
      return _.assign({}, state, {
        leasesList: action.payload
      });

    case types.LEASE_DETAILS_LOAD:
      return _.assign({}, state, {
        leaseDetails: action.payload
      });

    case types.PROPERTIES_LIST_LOAD:
      return _.assign({}, state, {
        propertiesList: action.payload
      });

    default:
      return state;
  }
}
