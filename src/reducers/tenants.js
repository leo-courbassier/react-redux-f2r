import * as types from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
  status: {
    loading: {},
    modified: {},
    saving: {},
    uploading: {}
  },
  tenantsList: []
};


export default function tenantsAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
    {
      let newState = _.assign({}, state);
      newState['status'][action.statusType][action.statusAction] = action.statusState;
      return newState;
    }

    case types.TENANTS_LIST_LOAD:
      return _.assign({}, state, {
        tenantsList: action.payload
      });

    default:
      return state;
  }
}
