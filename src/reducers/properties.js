import * as types from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
  status: {
    loading: {},
    modified: {},
    saving: {},
    uploading: {}
  },
  editMode: {},
  propertiesList: [],
  propertyProfile: {},
  propertyLeases: [],
  propertyTenants: []
};


export default function propertiesAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
    {
      let newState = _.assign({}, state);
      newState['status'][action.statusType][action.statusAction] = action.statusState;
      return newState;
    }

    case types.PROPERTY_EDIT_MODE:
    {
      let newState = _.assign({}, state);
      newState.editMode[action.panelName] = action.value;
      return newState;
    }

    case types.PROPERTIES_LIST_LOAD:
      return _.assign({}, state, {
        propertiesList: action.payload
      });

    case types.PROPERTY_PROFILE_LOAD:
      return _.assign({}, state, {
        propertyProfile: action.payload
      });

    case types.PROPERTY_LEASES_LOAD:
      return _.assign({}, state, {
        propertyLeases: action.payload
      });

    case types.PROPERTY_TENANTS_LOAD:
      return _.assign({}, state, {
        propertyTenants: action.payload
      });

    default:
      return state;
  }
}
